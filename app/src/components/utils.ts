// export const imageProxy = (path: string): typeof path => {
//   if (path?.startsWith("/api/imageProxy")) {
//     throw new Error(`imageProxy: path already proxied ${path}`);
//   }
//   return path ? `/api/imageProxy?imageUrl=${path}` : path;
// };

// TODO remove this if not needed
export const imageProxy = (path: string): typeof path => path;
