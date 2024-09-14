document.getElementById('websiteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const repoName = document.getElementById('repoName').value;
    const htmlContent = document.getElementById('htmlContent').value;
    const cssContent = document.getElementById('cssContent').value || '';
    const jsContent = document.getElementById('jsContent').value || '';
    const authToken = document.getElementById('authToken').value;

    const repoData = {
        name: repoName,
        description: "Website uploaded via app",
        auto_init: true
    };

    try {
        // Create a new repository on GitHub
        const response = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `token ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repoData)
        });

        if (response.ok) {
            const repo = await response.json();
            const repoUrl = repo.html_url;

            // Add HTML file to the repo
            await uploadFile(repoName, 'index.html', htmlContent, authToken);
            if (cssContent) await uploadFile(repoName, 'style.css', cssContent, authToken);
            if (jsContent) await uploadFile(repoName, 'script.js', jsContent, authToken);

            document.getElementById('status').textContent = `Website created successfully: ${repoUrl}`;
        } else {
            throw new Error('Failed to create repository.');
        }
    } catch (error) {
        document.getElementById('status').textContent = `Error: ${error.message}`;
    }
});

async function uploadFile(repoName, filePath, content, authToken) {
    const base64Content = btoa(content);
    const fileData = {
        message: `Add ${filePath}`,
        content: base64Content
    };

    const response = await fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileData)
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${filePath}`);
    }
}
