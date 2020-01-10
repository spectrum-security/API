module.exports = {
  db: {
    error: {
      name: "dbError",
      message: {
        pt: "Algo correu mal, veridique a ligação com a base de dados."
      },
      status: 503,
      success: false
    }
  },
  internalServerError: {
    name: "internalServerError",
    message: "Alguma coisa correu mal na nossa parte.",
    status: 500,
    success: false
  },
  user: {
    notFound: {
      name: "usersNotFound",
      message: {
        pt: "Nenhum utilizador encontrado."
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
        pt: "Email não encontrado."
      },
      status: 404,
      success: false
    },
    invalidPassword: {
      name: "invalidPassword",
      message: {
        pt: "Palavra-passe inválida."
      },
      status: 401,
      success: false
    },
    loginSuccess(jwt, user) {
      return {
        name: "valid",
        message: {
          pt: "Sessão iniciada."
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
          pt: "Preencha todos os campos corretamente."
        },
        content: { error: errors },
        status: 400,
        success: false
      };
    },
    signUpSuccess: {
      name: "signUpSuccess",
      message: {
        pt: "Conta criada com sucesso."
      },
      status: 200,
      success: true
    },
    insufficientPermissions: {
      name: "insufficientPermissions",
      message: {
        pt: "Sem permissões."
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
        pt: "Token necessário."
      },
      status: 401,
      success: false
    },
    malformated: {
      name: "malformatedToken",
      message: {
        pt: "Token desformatado."
      },
      status: 401,
      success: false
    },
    invalid: {
      name: "invalidToken",
      message: {
        pt: "Token inválido."
      },
      status: 401,
      success: false
    }
  }
};
