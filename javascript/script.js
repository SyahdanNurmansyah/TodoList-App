
/**
 * Variabel todos adalah sebuah variabel berisi array yang akan menampung beberapa object. Object ini berisikan data-data Todo user. 
 */

const todos = [];


/**
 * Variabel RENDER_EVENT bertujuan untuk mendefinisikan Custom Event dengan nama 'render-todo'. 
 * 
 * Custom event ini digunakan sebagai patokan dasar ketika ada perubahan data pada variabel todos, seperti perpindahan todo (dari incomplete menjadi complete, dan sebaliknya), menambah todo, maupun menghapus todo. 
 */
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();

        function addTodo() {
            const textTodo = document.getElementById('title').value;
            const timestamp = document.getElementById('date').value;

            const generateID = generateId();
            const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
            todos.push(todoObject);

            document.dispatchEvent(new Event(RENDER_EVENT));
        }

        /**
        * generateId() berfungsi untuk menghasilkan identitas unik pada setiap item todo. Untuk menghasilkan identitas yang unik, kita manfaatkan +new Date() untuk mendapatkan timestamp pada JavaScript.
        */

        function generateId() {
            return +new Date();
        }
        
        /**
         * generateTodoObject() berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan (parameter function), diantaranya id, nama todo (task), waktu (timestamp), dan isCompleted (penanda todo apakah sudah selesai atau belum).
         */
        function generateTodoObject(id, task, timestamp, isCompleted) {
            return {
                id,
                task,
                timestamp,
                isCompleted,
            }
        }
        document.addEventListener(RENDER_EVENT, function () {
            // console.log(todos);
            const uncompletedTODOList = document.getElementById('todos');
            uncompletedTODOList.innerHTML = '';

            // Menghapus element seelunya dengan innerHTML = ''
            const completedTODOList = document.getElementById('completed-todos');
            completedTODOList.innerHTML = '';

            for (const todoItem of todos) {
                const todoElement = makeTodo(todoItem);

                if (!todoItem.isCompleted)
                    uncompletedTODOList.append(todoElement);
                
                // Menambahkan todoElement ke completedTODOList menggunkan else statement
                else
                    completedTODOList.append(todoElement);
            };
        });

            /** OUTPUT
            {
                id: 1730639885907
                isCompleted: false
                task: "Ngoding"
                timestamp: "2024-11-06"
            }
        */

        function makeTodo(todoObject) {

            // Membuat element Heading Level-2 (Child Element) baru yang akan membawa data ke variable task
            const textTitle = document.createElement('h2');
            textTitle.innerText = todoObject.task;
            
            // Membuat element Paragraf  (Child Element) baru yang akan membawa data ke variable timestamp
            const textTimestamp = document.createElement('p');
            textTimestamp.innerText = todoObject.timestamp;

            // Membuat element Div baru untuk meanampung 2 elemen baru di atas (Parent Element) menggunakan method append()
            const textContainer = document.createElement('div');

            // Menambhhkan class inner pada elemen Div baru
            textContainer.classList.add('inner');
            textContainer.append(textTitle, textTimestamp);

            // Menerapkan style menggunakan property classList baru
            const container = document.createElement('div');
            container.classList.add('item', 'shadow');
            container.append(textContainer);

            // Memberikan atribut ID agar data mudah dikelola
            container.setAttribute('id', `todo-${todoObject.id}`);

            if (todoObject.isCompleted) {
                const undoButton = document.createElement('button');
                undoButton.classList.add('undo-button');

                undoButton.addEventListener('click', function () {
                    undoTaskFromCompleted(todoObject.id);
                });

                const trashButton = document.createElement('button');
                trashButton.classList.add('trash-button');

                trashButton.addEventListener('click', function () {
                    removeTaskFromCompleted(todoObject.id);
                });

                container.append(undoButton, trashButton);
            } else {
                const checkButton = document.createElement('button');
                checkButton.classList.add('check-button');

                checkButton.addEventListener('click', function () {
                    addTaskToCompleted(todoObject.id);
                });

                container.append(checkButton);
            }

            return container;
        };

        //  Fungsi ini digunakan untuk memindahkan todo dari rak “Yang harus dilakukan” ke “Yang sudah dilakukan”.

        // Prinsipnya adalah merubah state isCompleted dari sebelumnya false ke true

        function addTaskToCompleted (todoId) {
            const todoTarget = findTodo(todoId);

            if (todoTarget === null) return;
            todoTarget.isCompleted = true;

            // panggil event RENDER_EVENT untuk memperbarui data yang ditampilkan.
            document.dispatchEvent(new Event (RENDER_EVENT));
        }

        function findTodo (todoId) {
            for (const todoItem of todos) {
                if (todoItem.id === todoId) {
                    return todoItem;
                }
            }

            return null;
        }

        function removeTaskFromCompleted(todoId) {
            const todoTarget = findTodoIndex(todoId);

            if (todoTarget === -1) return;

            todos.splice(todoTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
        }

        // Funsi ini mirip dengan addTaskToCompleted, bedanya adalah pada state isCompleted nilainya diubah ke false.
        function undoTaskFromCompleted(todoId) {
            const todoTarget = findTodo(todoId);

            if (todoTarget === null) return;

            todoTarget.isCompleted = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
        }

        function findTodoIndex(todoId) {
            for (const index in todos) {
                if (todos[index].id === todoId) {
                    return index;
                }
            }
        }
    });
})