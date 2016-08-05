/**
 * Вивчення JavaScript
 * Урок 14. Теми:
 * - Практичне використання колбеків і замикань.
 * - Приклад простого застосунку, що аналізує домашні роботи.
 *
 * Щоб завантажити урок у Шелл:
 * Core.Load('../../lessons/13/l-13.js');
 */

(function () {

  // JS Course Model
  var jsCourse = {
    lessons: [
      {
        lessonNumber: 1,
        name: "Introduction",
        theory: "Lesson 3 Content",
        practice: function(){}
      }, {
        lessonNumber: 2,
        name: "Lesson 2",
        theory: "Lesson 3 Content",
        practice: function(){}
      }, {
        lessonNumber: 3,
        name: "Lesson 3",
        theory: "Lesson 3 Content",
        practice: function(){}
      }
    ],
    homeworks: [
      {
        lessonNumber: 1,
        student: "name@testserver.com",
        tasks: [
          {
            lessonNumber: 1,
            taskNumber: 1,
            text: "Task 1",
            done: true
          }
        ]
      }, {
        lessonNumber: 2,
        student: "name@testserver.com",
        tasks: [
          {
            lessonNumber: 2,
            taskNumber: 1,
            text: "Task 1",
            done: false
          }
        ]
      }, {
        lessonNumber: 3,
        student: "name@testserver.com",
        tasks: [
          {
            lessonNumber: 3,
            taskNumber: 1,
            text: "Task 1",
            done: false
          }
        ]
      }
    ]
  }

  /**
   * Returns a lessons for given student and given performance criteria
   * @param student Student email
   * @param done Is homework done
   * @return lessons Array of lessons
   */
   function getLessonsDoneByStudent(student, done) {

       var filteredLessons = [];
       filteredLessons = jsCourse.lessons.filter(function(lesson, index, array) {
           var filterResult = false;

           var filteredHomeworks = jsCourse.homeworks.filter(function(homework) {
               var allTasksDone = false;

               allTasksDone = homework.tasks.every(function(task) {
                   return task.done === done;
               });

               return homework.student === student && allTasksDone;
           });

           //FIXME
           filterResult = filteredHomeworks.filter(function(homework) {
               return homework.lessonNumber === lesson.lessonNumber
           });

           return filterResult;

       });

       return filteredLessons;
   }

   function logLessons() {
     var stringFromJSON = JSON.stringify(jsCourse.lessons, null, '    ');
     var objBackFromString = JSON.parse(stringFromJSON);
     console.log( stringFromJSON, objBackFromString );
   }

   function logHomeworks() {
     console.log( jsCourse.homeworks );
   }

   var doneLessons = getLessonsDoneByStudent("name@testserver.com", true);
   var undoneLessons = getLessonsDoneByStudent("name@testserver.com", false);

   console.log('Lessons done: ', doneLessons);
   console.log('Lessons NOT done: ', undoneLessons);

   //logLessons();
   //logHomeworks();

})()
