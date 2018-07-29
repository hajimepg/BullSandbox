import test from "ava";
import Queue from "bull";

test("create Job", async (t) => {
    t.plan(0);

    const queue = new Queue("test");

    await queue.add({});
});

test("process Job", async (t) => {
    t.plan(0);

    const queue = new Queue("add");

    await queue.add({ lhs: 1, rhs: 2 });

    queue.process(async (job) => {
        return job.data.lhs + job.data.rhs;
    });
});

test("receive job completed event", (t) => {
    return new Promise(async (resolve, reject) => {
        const queue = new Queue("event test");

        queue.on("completed", (job, result) => {
            t.is(3, result);
            resolve();
        });

        await queue.add({ lhs: 1, rhs: 2 });

        queue.process(async (job) => {
            return job.data.lhs + job.data.rhs;
        });

        setTimeout(reject, 100);
    });
});
