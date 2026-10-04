// Course Schedule — practice (cycle detection, 3-state DFS)
//
// prerequisites[i] = [a, b] means: to take a, you must first take b.
// Return true if you can finish all courses (i.e. the dependency graph has
// no cycle).
//
//   Q1 node = course
//   Q2 edge = a -> b  ("a depends on b")
//   Q3 wrap = detect a cycle in a directed graph. 3 states:
//             0 unvisited, 1 in-progress (on current path), 2 done.

enum CourseState {
  NotStarted,
  InProgress,
  Done
}

class Course  {
  requirements: number[];
  state: CourseState;

  constructor() {
    this.state = CourseState.NotStarted
    this.requirements = [];
  }
}

function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const courses: Course[] = [];

  for(let course = 0; course < numCourses; course++) {
    courses.push(new Course());
  }

  for (const [course, prereq] of prerequisites) {
    courses[course].requirements.push(prereq);
  }

  function hasCycle(course: Course): boolean {
    if (course.state === CourseState.Done) {
      return false;
    }

    if (course.state === CourseState.InProgress) {
      return true;
    }

    course.state = CourseState.InProgress;

    for(const prereq of course.requirements) {
      if (hasCycle(courses[prereq])) {
        return true;
      }
    }

    course.state = CourseState.Done;
    return false;
  }

  for(let i = 0;i < courses.length; i++) {
    if (hasCycle(courses[i])) {
      return false
    }
  }

  return true;
}

// --- quick test harness ---
const cases: [number, number[][], boolean][] = [
  [2, [[1, 0]], true],                                // 0 -> 1, no cycle
  [2, [[1, 0], [0, 1]], false],                       // 0 <-> 1 cycle
  [4, [[1, 0], [2, 1], [3, 2]], true],                // chain
  [3, [[0, 1], [1, 2], [2, 0]], false],               // 3-cycle
  [5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], true], // diamond+
  [1, [], true],                                      // no prereqs
];
for (const [n, prereqs, exp] of cases) {
  const got = canFinish(n, prereqs);
  console.log(`${got === exp ? "✓" : "✗"} canFinish(${n}, ${JSON.stringify(prereqs)}) = ${got} (exp ${exp})`);
}
