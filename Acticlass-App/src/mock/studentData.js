const studentData = [];

for (let i = 1; i <= 50; i++) {
    const group = {
        name: `Student ${i}`,
        email: `std${i}@gmail.com`,
        points: Math.floor(Math.random() * 10001),
    };
    studentData.push(group);
}

export default studentData;
