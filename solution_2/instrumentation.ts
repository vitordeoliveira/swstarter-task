export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeQueue } = await import('./lib/queue-init');
    await initializeQueue();
  }
}

