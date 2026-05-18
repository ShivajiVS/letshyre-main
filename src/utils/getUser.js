// export function getUser() {
//   const user = localStorage.getItem("user");

//   if (!user) {
//     return {
//       isAuthenticated: true,
//       role: "employer",
//     };
//   }

//   const parsed = JSON.parse(user);

//   return {
//     isAuthenticated: true,
//     role: parsed.role,
//     user: parsed,
//   };
// }

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user) return { sAuthenticated: false, role: null };

  console.log("user is ", user);

  const parsed = JSON.parse(user);

  return {
    isAuthenticated: true,
    role: parsed.role,
    user: parsed,
  };

  // later replace with real logic (context / API / token)
}

/*
  return {
    isAuthenticated: false,
    role: "employer",
  };
*/

//  console.log("auth is", user);

//   console.log("======================");

//   console.log("user role ", user?.role);

//   console.log("=========final object=============");

//   console.log("final object", {
//     isAuthenticated: true,
//     role: user?.role,
//   });
