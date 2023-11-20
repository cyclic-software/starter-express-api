#include <napi.h>

struct InstanceData {
  Napi::FunctionReference ImageBackendCtor;
  Napi::FunctionReference PdfBackendCtor;
  Napi::FunctionReference SvgBackendCtor;
  Napi::FunctionReference CanvasCtor;
};
