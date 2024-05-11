"use server";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import {
  encryptId,
  extractCustomerIdFromUrl,
  parseStringify,
} from "@/lib/utils";
import { plaidClient } from "@/lib/plaid";
import {
  addFundingSource,
  createDwollaCustomer,
} from "@/lib/actions/dwolla.actions";

const {
  APPWRITE_DATABASE_ID,
  APPWRITE_BANK_COLLECTION_ID,
  APPWRITE_USER_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(session);
  } catch (err) {
    console.log("Error", err);
  }
};

export const signUp = async ({password, ...userData}: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  try {
    const { account, database } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (err) {
    console.log("Error", err);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const response = await account.get();

    return parseStringify(response);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    account.deleteSession("current");
  } catch (err) {
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (err) {
    console.log(err);
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      ID.unique(),
      { userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId }
    );

    return parseStringify(bankAccount);
  } catch (err) {
    console.log(err);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the dwolla customer ID,
    // processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    /// If the funding Source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access Token,
    // funding source URL, and sharable Id
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (err) {
    console.log(err);
  }
};
