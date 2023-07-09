import cluster from 'cluster';
import { cpus } from 'os';
import { pid } from 'process';

const startNewWorker = () => {
  const worker = cluster.fork();
  worker.on('online', () => {
    console.log(`Worker ${worker.id} started`);
  });
};
const startCluster = async () => {
  if (cluster.isPrimary) {
    const cpusCount = cpus().length;

    console.log(`Masper pid ${pid} started ${cpusCount} workers`);

    for (let i = 0; i < cpusCount; i += 1) {
      startNewWorker();
    }
  } else {
    const workerId = cluster.worker?.id || 0;
    await import('./index');
    console.log(`Worker id:${workerId} pid:${pid} `);
  }
};

startCluster();
