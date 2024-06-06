self.onmessage = async (e) => {
    const file = e.data;
    const reader = new FileReader();

    reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        postMessage(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
};