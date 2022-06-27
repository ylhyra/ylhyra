import { Request, Router } from "express";
import axios2 from "modules/axios2";
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
 * @example
 *   typedAxios<ApiTypesInterface>("CONSTANT", ApiConstantToMethodAndUrl);
 */
export async function typedAxiosSetup<
  Types extends ApiTypesInterface,
  Constant extends keyof ApiTypesInterface
>(
  constant: Constant,
  data?: EmptyObjectIfNull<ApiTypesInterface[Constant]["request"]>
): Promise<EmptyObjectIfNull<ApiTypesInterface[Constant]["response"]>> {
  const method = apiUrls[constant as keyof typeof apiUrls][0];
  const url = apiUrls[constant as keyof typeof apiUrls][1];
  let postData2;
  if (method === "get") {
    postData2 = { params: data };
  } else {
    postData2 = data;
  }
  return await axios2[method]<
    EmptyObjectIfNull<ApiTypesInterface[Constant]["request"]>,
    EmptyObjectIfNull<ApiTypesInterface[Constant]["response"]>
  >(url, postData2);
}

export function typedRouterSetup<T extends keyof ApiTypesInterface>(
  router: Router,
  constant: T,
  callback: (
    req: Request<
      {},
      {},
      EmptyObjectIfNull<ApiTypesInterface[T]["request"]>,
      {}
    >,
    res: TypedResponse<EmptyObjectIfNull<ApiTypesInterface[T]["response"]>>
  ) => void
): void {
  const method = apiUrls[constant as keyof typeof apiUrls][0];
  const url = apiUrls[constant as keyof typeof apiUrls][1];
  router[method](url, callback);
}
