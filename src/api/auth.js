export const LoginFuntion = async (email, password) => {
  try {
    const result = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!result.ok) return result.json("Error logging in");

    return await result.json();
  } catch (error) {
    console.error(error);
  }
};

export const Register = async (email, password) => {
  try {
    const result = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!result.ok) return result.json("Error registering");

    return result.json();
  } catch (error) {
    console.error(error);
  }
};
