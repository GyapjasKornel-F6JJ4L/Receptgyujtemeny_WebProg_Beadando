
async function get_receipeName() {
    const response = await fetch('api/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'get_receipeName'
        })
    });
    const data = await response.json();

    for (const receipe of data) {
        console.log(receipe.title);
    };
}
get_receipeName();
