const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");


app.use(express.json()); // JSON 데이터 처리
app.use(cors());

let tasks = []; // 임시 데이터 저장소

// GET: 할 일 목록 가져오기
app.get("/api/tasks", (req, res) => {
  const { showCompleted, sortOrder } = req.query;
  // 필터링
  let filteredTasks = tasks;
  
  if (showCompleted === "false") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  // 정렬
  if (sortOrder === "alphabetical") {
    filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortOrder === "completed") {
    filteredTasks.sort((a, b) => a.completed - b.completed);
  }
  
  res.json(filteredTasks);
});

// POST: 새 할 일 추가
app.post("/api/tasks", (req, res) => {
  const newTask = req.body;
  tasks.push({ ...newTask, id: Date.now() });
  res.status(201).json({ message: "Task added!" });
});

// DELETE: 할 일 삭제
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.json({ message: "Task deleted!" });
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);     // 경로에서 id 가져오기
  const { completed } = req.body;   
  console.log('taskId', taskId);
  const task = tasks.find((task) => task.id === taskId ); // 해당 ID의 항목 찾기
  if (task) {
    task.completed = completed;
    res.json({ message: "Task updated!" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});