import { MilkdownPlugin } from "@milkdown/kit/ctx";

export const myPlugin: MilkdownPlugin = (ctx) => {
  // #1 prepare plugin
  return async () => {
    // #2 run plugin
		console.log("Plugin loaded")
    return async () => {
      // #3 clean up plugin
    };
  };
};