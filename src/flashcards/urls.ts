import {
  ApiConstantToMethodAndUrl,
  ApiTypesInterface,
  typedAxiosSetup,
} from "modules/typedApi";

export const apiUrls: ApiConstantToMethodAndUrl = {
  // API_MEETING_GET: ["get", "/api/meetings"],
};

export interface ApiTypes2 extends ApiTypesInterface {
  // API_FRIENDS_GET: {
  //   request: null;
  //   response: null;
  // };
}

// export const typedAxios = typedAxiosSetup<ApiTypes2>(apiUrls);
