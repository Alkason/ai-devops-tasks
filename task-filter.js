function getCompletedTaskTitles(tasks) {
  return tasks
    .filter(task => task.status === 'completed') // 1. Filtrowanie po statusie
    .sort((a, b) => a.id - b.id)                  // 2. Sortowanie po id (rosnąco)
    .map(task => task.title);                    // 3. Wyciągnięcie samych tytułów
}