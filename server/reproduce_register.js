
const registerUser = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Registration successful:', data);
        } else {
            console.error('Registration failed:', data);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
};

registerUser();
