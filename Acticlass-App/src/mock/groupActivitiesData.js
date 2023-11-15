import { random } from "lodash";
import { ACTIVITY_TYPES } from "../common/constants";

const activitiesData = [];

for (let i = 1; i <= 50; i++) {
    let data = {};
    data.id = `Activity ${i}`;
    data.type = Object.values(ACTIVITY_TYPES)[i % 8];
    data.timestamp = Date.now();
    data.group = `Group ${i}`;
    data.triggerBy = `User ${i}`;
    data.triggerFor = `Activity ${i}`;
    data.points = random(0, 100);
    activitiesData.push(data);
}

export default activitiesData;
