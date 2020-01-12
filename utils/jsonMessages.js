module.exports = {
  db: {
    error: {
      name: "dbError",
      message: {
        pt: "Algo correu mal, veridique a ligação com a base de dados.",
        en:
          "Something went wrong. Please check the connection with the database"
      },
      status: 503,
      success: false
    }
  },
  internalServerError: {
    name: "internalServerError",
    message: {
      pt: "Alguma coisa correu mal na nossa parte.",
      en: "Something went wrong on our end"
    },
    status: 500,
    success: false
  },
  user: {
    notFound: {
      name: "usersNotFound",
      message: {
        pt: "Nenhum utilizador encontrado.",
        en: "No user was found"
      },
      content: {
        users: []
      },
      status: 404,
      success: false
    },
    getUsers(users, name) {
      return {
        name,
        content: {
          users
        },
        status: 200,
        success: true
      };
    },
    invalidEmail: {
      name: "invalidEmail",
      message: {
        pt: "Email não encontrado.",
        en: "Email adress was not found"
      },
      status: 404,
      success: false
    },
    invalidPassword: {
      name: "invalidPassword",
      message: {
        pt: "Palavra-passe inválida.",
        en: "The password submited is incorrect"
      },
      status: 401,
      success: false
    },
    loginSuccess(jwt, user) {
      return {
        name: "valid",
        message: {
          pt: "Sessão iniciada.",
          en: "You are now signed in"
        },
        content: { jwt, user },
        status: 200,
        success: true
      };
    },
    signUpError(errors) {
      return {
        name: "signUpError",
        message: {
          pt: "Preencha todos os campos corretamente.",
          en: "Fill all the fields correctly"
        },
        content: { error: errors },
        status: 400,
        success: false
      };
    },
    signUpSuccess: {
      name: "signUpSuccess",
      message: {
        pt: "Conta criada com sucesso.",
        en: "Account created with success"
      },
      status: 200,
      success: true
    },
    insufficientPermissions: {
      name: "insufficientPermissions",
      message: {
        pt: "Sem permissões.",
        en: "You don't have sufficient permissions"
      },
      status: 403,
      success: false
    }
  },
  success(name, content) {
    return {
      name,
      content,
      status: 200,
      success: true
    };
  },
  token: {
    missing: {
      name: "missingToken",
      message: {
        pt: "Token necessário.",
        en: "Token is necessary"
      },
      status: 401,
      success: false
    },
    malformated: {
      name: "malformatedToken",
      message: {
        pt: "Token desformatado.",
        en: "Malformed Token"
      },
      status: 401,
      success: false
    },
    invalid: {
      name: "invalidToken",
      message: {
        pt: "Token inválido.",
        en: "Invalid Token"
      },
      status: 401,
      success: false
    }
  }
};
