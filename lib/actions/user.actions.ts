'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../server/appwrite"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"

export const signIn = async ({email, password}: signInProps) => {
    try {
        const {account} = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(session);
    } catch (err) {
        console.log('Error', err)
    }
}

export const signUp = async (userData: SignUpParams) => {
    const {email, password, firstName, lastName} = userData;
    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        const session = await account.createEmailPasswordSession(email, password);
      
        cookies().set("appwrite-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUserAccount)
    } catch (err) {
        console.log('Error', err)
    }
}


export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const response = await account.get();

      return parseStringify(response);
    } catch (error) {
      console.log(error)
      return null;
    }
  }

export async function logoutUser() {
  try {
    const {account} = await createSessionClient();

    cookies().delete('appwrite-session');

    account.deleteSession('current');
  } catch(err) {
    return null;
  }
}
  