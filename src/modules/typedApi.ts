import axios2 from "modules/axios2";
import { Request, Router } from "express";
import { EmptyObjectIfNull } from "modules/typescript/emptyObject";
import { TypedResponse } from "modules/typescript/express";

export interface ApiTypesInterface {
  [constant: string]: {
    request: any;
    response: any;
  };
}
export interface ApiConstantToMethodAndUrl {
  [constant: string]: ["get" | "post" | "patch", string];
}

/**
 *
 * @example
 * typedAxios<ApiTypes>('CONSTANT', ApiConstantToMethodAndUrl)
 */
export async function typedAxiosSetup<
  Types extends ApiTypes,
  Constant extends keyof ApiTypes
>(
  constant: Constant,
  data?: EmptyObjectIfNull<ApiTypes[Constant]["request"]>
): Promise<EmptyObjectIfNull<ApiTypes[Constant]["response"]>> {
  const method = apiUrls[constant as keyof typeof apiUrls][0];
  const url = apiUrls[constant as keyof typeof apiUrls][1];
  let postData2;
  if (method === "get") {
    postData2 = { params: data };
  } else {
    postData2 = data;
  }
  return await axios2[method]<
    EmptyObjectIfNull<ApiTypes[Constant]["request"]>,
    EmptyObjectIfNull<ApiTypes[Constant]["response"]>
  >(url, postData2);
}

export function typedRouterSetup<T extends keyof ApiTypes>(
  router: Router,
  constant: T,
  callback: (
    req: Request<{}, {}, EmptyObjectIfNull<ApiTypes[T]["request"]>, {}>,
    res: TypedResponse<EmptyObjectIfNull<ApiTypes[T]["response"]>>
  ) => void
): void {
  const method = apiUrls[constant as keyof typeof apiUrls][0];
  const url = apiUrls[constant as keyof typeof apiUrls][1];
  router[method](url, callback);
}
