import { workerData, parentPort } from "worker_threads";
import { testBlueprint } from "./algo19.js";

// you can do intensive sychronous stuff here
function theCPUIntensiveTask({ blueprint, time }) {
  let k = testBlueprint(blueprint, time);

  return { id: blueprint.id, geodes: k };
}

const intensiveResult = theCPUIntensiveTask(workerData);

parentPort.postMessage(intensiveResult);
