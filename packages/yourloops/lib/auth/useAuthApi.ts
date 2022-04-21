import { useHttp } from "../../services/useHttp";
import { IUser, Preferences, Profile, Settings } from "../../models/shoreline";

export const useAuthApi = () => {
  const { getRequest, postRequest } = useHttp();

  const getUser = async (email: string) => postRequest<IUser>({ url: `auth/hack/user/${email}` });

  const getProfile = async (userId: string): Promise<Profile> => {
    const { data } = await getRequest<Profile>({ url: `/metadata/${userId}/profile` });
    return data;
  };

  const getPreferences = async (userId: string): Promise<Preferences> => {
    const { data } = await getRequest<Preferences>({ url: `/metadata/${userId}/preferences` });
    return data;
  };

  const getSettings = async (userId: string): Promise<Settings> => {
    const { data } = await getRequest<Settings>({ url: `/metadata/${userId}/settings` });
    return data;
  };

  return { getProfile, getPreferences, getSettings, getUser };
};
