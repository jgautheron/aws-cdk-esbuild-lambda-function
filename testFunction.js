var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// test/lambda/testFunction.ts
__export(exports, {
  handler: () => handler
});
var handler = () => {
  console.log("test");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
