document.addEventListener("DOMContentLoaded", function () {
    // Borra el localStorage al cargar la página
    localStorage.clear();

    const form = document.getElementById("jsonForm");
    const recordList = document.getElementById("recordList");
    const recordsKey = "jsonRecords";
    const botonesBorrar = document.querySelectorAll(".borrar-btn");

    // Array para almacenar los registros cargados desde el archivo JSON
    let records = [];
    const storedRecords = localStorage.getItem(recordsKey);
    if (storedRecords) {
        records = JSON.parse(storedRecords);
    }

    // Agregar un controlador de eventos al botón "Cargar JSON Existente"
    const jsonFileInput = document.getElementById("jsonFile");
    jsonFileInput.addEventListener("change", function () {

        // Verificar si se ha seleccionado un archivo
        if (jsonFileInput.files.length > 0) {
            const file = jsonFileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                try {
                    records = JSON.parse(event.target.result);
                    // Guardar los registros en la caché del navegador
                    localStorage.setItem(recordsKey, JSON.stringify(records));
                    renderRecordList();
                } catch (error) {
                    alert("Error al procesar el archivo JSON.");
                }
            };

            // Leer el archivo JSON cargado
            reader.readAsText(file);
        } else {
            alert("Por favor, seleccione un archivo JSON.");
        }
    });

    // Agregar un controlador de eventos al botón "Descargar JSON Actualizado"
    const downloadJsonBtn = document.getElementById("downloadJsonBtn");
    downloadJsonBtn.addEventListener("click", function () {
        // Crear un Blob con el contenido JSON actualizado
        const updatedJsonBlob = new Blob([JSON.stringify(records)], { type: "application/json" });

        // Crear un enlace de descarga y simular un clic en él
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = URL.createObjectURL(updatedJsonBlob);
        a.download = "updatedData.json";
        document.body.appendChild(a);
        a.click();
    });

    // Agregar un controlador de eventos al formulario principal para agregar registros
    form.addEventListener("submit", function (event) {

        const data = localStorage.getItem(recordsKey);


        // Parsea el contenido de localStorage como JSON para obtener un arreglo
        const recordsArray = JSON.parse(data);

        // Obtiene el número de elementos en el arreglo
        const numberOfElements = recordsArray.length;

        event.preventDefault();

        const id = data ? parseInt(numberOfElements) + 1 : 1;
        const title = document.getElementById("title").value;
        const price = parseFloat(document.getElementById("price").value);
        const description = document.getElementById("description").value;
        const linkVntd = document.getElementById("linkVntd").value;
        const linkWll = document.getElementById("linkWll").value;
        const jsonTextArea = document.getElementById("jsonTextArea").value;
        const lines = jsonTextArea.split('\n');
        const imagesArray = [];

        for (const line of lines) {
            if (line.trim() !== '') {
                imagesArray.push(line.trim());
            }
        }

        // Crear un nuevo objeto con la estructura especificada
        const newRecord = {
            id: id,
            title: title,
            price: price,
            description: description,
            linkVntd: linkVntd,
            linkWll: linkWll,
            images: imagesArray
        };

        // Agregar el nuevo registro al arreglo de registros
        records.push(newRecord);
        // Guardar los registros en la caché del navegador
        localStorage.setItem(recordsKey, JSON.stringify(records));

        // Limpiar el formulario
        form.reset();

        // Renderizar la lista actualizada de registros
        renderRecordList();
    });

    function borrarFila(button) {
        var fila = button;
        alert(fila)
    }

    function borrarFila(id){
        alert(id)
    }

    // Función para renderizar la lista de registros
    function renderRecordList() {
        // Limpiar la lista existente
        recordList.innerHTML = "";

        // Iterar a través de los registros y crear un formulario de edición para cada uno
        records.forEach((record, index) => {
            const recordForm = document.createElement("form");
            recordForm.innerHTML = `
            
            <h5 data-bs-toggle="collapse" href="#collapse${record.id}" role="button" aria-expanded="false" aria-controls="collapseExample"  class="gap-4 accordion-button d-flex mb-0">
                <img src="${record.images[0]}" class="rounded-circle d-inline" alt="..." width="50" height="50"> ${record.title} 
            </h5>
            <div class="collapse p-4 bg-white border" id="collapse${record.id}">
                <div class="mb-3">
                    <label for="editId${index}" class="form-label">ID:</label>
                    <input type="number" class="form-control" id="editId${index}" value="${record.id}" readonly>
                </div>
                <div class="mb-3">
                    <label for="editTitle${index}" class="form-label">Título:</label>
                    <input type="text" class="form-control" id="editTitle${index}" value="${record.title}" >
                </div>
                <div class="mb-3">
                    <label for="editPrice${index}" class="form-label">Precio:</label>
                    <input type="number" class="form-control" id="editPrice${index}" value="${record.price}" >
                </div>
                <div class="mb-3">
                    <label for="editDescription${index}" class="form-label">Descripción:</label>
                    <input type="text" class="form-control" id="editDescription${index}" value="${record.description}">
                </div>
                <div class="mb-3">
                    <label for="editLinkVntd${index}" class="form-label">Enlace Vntd:</label>
                <input type="text" class="form-control" id="editLinkVntd${index}" value="${record.linkVntd}">
            </div>
            <div class="mb-3">
                <label for="editLinkWll${index}" class="form-label">Enlace Wll:</label>
                <input type="text" class="form-control" id="editLinkWll${index}" value="${record.linkWll}" >
            </div>
            <div class="mb-3">
                <label for="editJsonTextArea${index}" class="form-label">URL de Imágenes (una por línea):</label>
                <textarea class="form-control" id="editJsonTextArea${index}" rows="5">${record.images.join("\n")}</textarea>
            </div>
            <div class="d-flex align-items-center justify-content-between">
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <button class="btn btn-outline-secondary borrar-btn" type="button" onclick="borrarFila(this)" data-id="${record.id}" >Borrar</button>
                </div>
            
            </div>`;

            // Agregar un controlador de eventos para guardar los cambios en el formulario de edición
            recordForm.addEventListener("submit", function (event) {
                event.preventDefault();

                // Obtener el índice del formulario actual
                const currentIndex = records.findIndex((r) => r.id === record.id);

                // Obtener los valores editados desde el formulario
                const editedId = parseInt(document.getElementById(`editId${currentIndex}`).value);
                const editedTitle = document.getElementById(`editTitle${currentIndex}`).value;
                const editedPrice = parseFloat(document.getElementById(`editPrice${currentIndex}`).value);
                const editedDescription = document.getElementById(`editDescription${currentIndex}`).value;
                const editedLinkVntd = document.getElementById(`editLinkVntd${currentIndex}`).value;
                const editedLinkWll = document.getElementById(`editLinkWll${currentIndex}`).value;
                const editedJsonTextArea = document.getElementById(`editJsonTextArea${currentIndex}`).value;
                const editedLines = editedJsonTextArea.split('\n');
                const editedImagesArray = [];

                for (const line of editedLines) {
                    if (line.trim() !== '') {
                        editedImagesArray.push(line.trim());
                    }
                }

                // Actualizar el registro con los valores editados
                record.id = editedId;
                record.title = editedTitle;
                record.price = editedPrice;
                record.description = editedDescription;
                record.linkVntd = editedLinkVntd;
                record.linkWll = editedLinkWll;
                record.images = editedImagesArray;

                // Actualizar la caché del navegador con los registros editados
                localStorage.setItem(recordsKey, JSON.stringify(records));

                var botonesBorrar = document.querySelectorAll(".boton-borrar");
                

                // Agregar un event listener a cada botón de borrar
                botonesBorrar.forEach(function(boton) {
                    boton.addEventListener("click", function() {
                        borrarFila(this);
                    });
                });
                


                // Renderizar la lista actualizada de registros
                renderRecordList();
            });

            recordList.appendChild(recordForm);
        });
    }
});
