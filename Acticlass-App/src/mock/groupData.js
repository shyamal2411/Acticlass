const groupData = [];

for (let i = 1; i <= 50; i++) {
    const group = {
        Name: `Group ${i}`,
        Status: i % 2 === 0 ? "Active" : "Inactive",
        PassingPoint: Math.floor(Math.random() * 100001),
        Radius: Math.floor(Math.random() * 11),
        Points: Math.floor(Math.random() * 10001),
    };
    groupData.push(group);
}

export default groupData;
