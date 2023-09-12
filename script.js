document.addEventListener("DOMContentLoaded", function () {
    // Borra el localStorage al cargar la página
    localStorage.clear();

    const form = document.getElementById("jsonForm");
    const recordList = document.getElementById("recordList");
    const recordsKey = "jsonRecords";

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
        const updatedJsonBlob = new Blob([localStorage.getItem(recordsKey)], { type: "application/json" });

        // Crear un enlace de descarga y simular un clic en él
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = URL.createObjectURL(updatedJsonBlob);
        a.download = "photo.json";
        document.body.appendChild(a);
        a.click();
    });

    // Agregar un controlador de eventos al formulario principal para agregar registros
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let numberOfElements;
        const data = localStorage.getItem(recordsKey);
        if (data) {

            // Parsea el contenido de localStorage como JSON para obtener un arreglo
            const recordsArray = JSON.parse(data);
            
            // Obtiene el número de elementos en el arreglo
            numberOfElements = recordsArray.length;
        }



        const id = data ? parseInt(numberOfElements) + 1 : 1;
        const title = document.getElementById("title").value;
        const price = parseFloat(document.getElementById("price").value);
        const description = document.getElementById("description").value;
        const linkVntd = document.getElementById("linkVntd").value;
        const linkWll = document.getElementById("linkWll").value;
        const soldOut = document.getElementById("soldOut").checked;
        const reserved = document.getElementById("reserved").checked;
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
            soldOut: soldOut,
            reserved: reserved,
            images: imagesArray
        };

        // Agregar el nuevo registro al arreglo de registros
       let upload = {};
        if (data && data != null) {
            upload =  JSON.parse(data);
            upload.unshift(newRecord);
            localStorage.setItem(recordsKey, JSON.stringify(upload));
        }else{
            records.unshift(newRecord);
            localStorage.setItem(recordsKey, JSON.stringify(records));
        }
        // Guardar los registros en la caché del navegador
        

        // Limpiar el formulario
        form.reset();

        // Renderizar la lista actualizada de registros
        renderRecordList();
    });

    // Función para renderizar la lista de registros
    function renderRecordList() {

        // Limpiar la lista existente
        recordList.innerHTML = "";
        let recordsToRender = records;

        const localStorageData = localStorage.getItem(recordsKey);
        let localStorageRecords;

        if (localStorageData) {
            try {
                const localStorageRecords = JSON.parse(localStorageData);
                // Comprueba que los datos del localStorage sean un arreglo
                if (Array.isArray(localStorageRecords)) {
                    recordsToRender = localStorageRecords;
                }
            } catch (error) {
                console.error("Error al analizar los datos del localStorage:", error);
            }
        }
        // Iterar a través de los registros y crear un formulario de edición para cada uno
        recordsToRender.forEach((record, index) => {
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
                        <div class="row">
                            <div class="col-md-6">
                                <label for="soldOut${index}" class="form-label">Vendido:</label>
                                <input type="checkbox" id="editSoldOut${index}" ${record.soldOut ? "checked" : ""} />
                            </div>
                            <div class="col-md-6">
                                <label for="reserved${index}" class="form-label">Reservado:</label>
                                <input type="checkbox" id="editReserved${index}" ${record.reserved ? "checked" : ""} />
                            </div>
                        </div>
                    </div>
            <div class="mb-3">
                <label for="editJsonTextArea${index}" class="form-label">URL de Imágenes (una por línea):</label>
                <textarea class="form-control" id="editJsonTextArea${index}" rows="5">${record.images.join("\n")}</textarea>
            </div>
            <div class="d-flex align-items-center justify-content-between">
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <button class="btn btn-outline-secondary boton-borrar" type="button" data-id="${record.id}" >Borrar</button>
                </div>
            
            </div>`;


            recordForm.addEventListener("submit", function (event) {
                event.preventDefault();
                let currentIndex
                // Obtener el índice del formulario actual
                let dataStorage = localStorage.getItem(recordsKey);
                if(dataStorage&& dataStorage!==null){
                    const parseData = JSON.parse(dataStorage)
                    currentIndex = parseData.findIndex((r) => r.id === record.id);
                }else{
                    currentIndex = records.findIndex((r) => r.id === record.id);
                }

                // Obtener los valores editados desde el formulario
                const editedId = parseInt(document.getElementById(`editId${currentIndex}`).value);
                const editedTitle = document.getElementById(`editTitle${currentIndex}`).value;
                const editedPrice = parseFloat(document.getElementById(`editPrice${currentIndex}`).value);
                const editedDescription = document.getElementById(`editDescription${currentIndex}`).value;
                const editedLinkVntd = document.getElementById(`editLinkVntd${currentIndex}`).value;
                const editedLinkWll = document.getElementById(`editLinkWll${currentIndex}`).value;
                const editSoldOut = document.getElementById(`editSoldOut${currentIndex}`).checked;
                const editReserved = document.getElementById(`editReserved${currentIndex}`).checked;
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
                record.soldOut = editSoldOut;
                record.reserved = editReserved;
                record.images = editedImagesArray;

                // Actualizar la caché del navegador con los registros editados
                localStorage.setItem(recordsKey, JSON.stringify(recordsToRender));


                // Renderizar la lista actualizada de registros
                renderRecordList();
            });



            recordList.appendChild(recordForm);
        });

        addBorrarbutons();
    }

    function addBorrarbutons() {
        // Agregar un controlador de eventos para guardar los cambios en el formulario de edición
        var botonesBorrar = document.querySelectorAll(".boton-borrar");

        // Agregar un event listener a cada botón de borrar
        botonesBorrar.forEach(function (boton) {
            boton.addEventListener("click", function () {
                // Obtiene el ID del atributo de datos del botón
                const id = boton.dataset.id;
                borrarElementoLocalStorage(id);
            });

        });

        function borrarElementoLocalStorage(id) {
            // Obtén el contenido actual del localStorage para la clave 'recordsKey' (reemplaza 'recordsKey' con el nombre real de tu clave)
            const localStorageContent = localStorage.getItem(recordsKey);

            // Verifica si el contenido existe en localStorage
            if (localStorageContent) {
                // Parsea el contenido de localStorage como JSON para obtener un arreglo de registros
                const recordsArray = JSON.parse(localStorageContent);

                // Filtra los registros para mantener solo aquellos cuyo ID no coincide con el ID pasado
                const registrosFiltrados = recordsArray.filter(record => record.id !== parseInt(id));

                // Actualiza el localStorage con los registros actualizados
                localStorage.setItem(recordsKey, JSON.stringify(registrosFiltrados));
                // Opcional: Puedes mostrar un mensaje de confirmación o realizar otras acciones después de borrar
                renderRecordList()
            }
        }
    }


});
