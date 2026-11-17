import { api } from "@/services/apiClient";

export const getUserProfile = async (
  id: string,
  token: string
) => {
  const res = await api.get(
    `/portal/Profile/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('This is profile res: ', res)

  return res.data;
};

export const deleteUserAccount = async (userId: string, token: string) => {
  const res = await api.delete(
    `/portal/PortalAccount/DeleteAccount?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const updateProfile = async (
  id: string,
  formData: FormData,
  token: string
) => {
  // fetch, not axios: on React Native a hand-set multipart
  // Content-Type has no boundary and the upload can fail, while
  // fetch builds the header itself.
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/portal/Profile/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    }
  );

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok || json?.status === false) {
    throw new Error(
      json?.message || `Upload failed (${res.status})`
    );
  }

  return json;
};