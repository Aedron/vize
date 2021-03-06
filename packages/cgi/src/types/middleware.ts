import {
  NextFunction as MiddlewareNextFunction,
  Request as MiddlewareRequest,
  Response as MiddlewareResponse,
} from 'express';
import { RouteInfo as MiddlewareRouteInfo } from '@nestjs/common/interfaces/middleware/middleware-configuration.interface';
import { RequestMethod as MiddlewareRequestMethod } from '@nestjs/common/enums';

export type CGIMiddlewareApply = (
  req: MiddlewareRequest,
  res: MiddlewareResponse,
  next: MiddlewareNextFunction,
) => any;

export interface CGIMiddleware {
  apply: CGIMiddlewareApply;
  forRoutes?: MiddlewareRouteInfo[];
  exclude?: MiddlewareRouteInfo[];
}

export {
  MiddlewareRouteInfo,
  MiddlewareRequestMethod,
  MiddlewareNextFunction,
  MiddlewareRequest,
  MiddlewareResponse,
};
