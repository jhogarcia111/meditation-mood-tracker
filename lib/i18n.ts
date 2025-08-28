export type Language = 'ES' | 'EN'

export interface Translations {
  // Página Principal
  hero: {
    title: string
    subtitle: string
    loginButton: string
    registerButton: string
  }
  features: {
    meditation: {
      title: string
      description: string
    }
    analytics: {
      title: string
      description: string
    }
    global: {
      title: string
      description: string
    }
  }

  // Autenticación
  auth: {
    login: {
      title: string
      subtitle: string
      userId: string
      password: string
      loginButton: string
      noAccount: string
      registerLink: string
    }
    register: {
      title: string
      subtitle: string
      userId: string
      email: string
      password: string
      confirmPassword: string
      country: string
      language: string
      registerButton: string
      hasAccount: string
      loginLink: string
    }
  }

  // Dashboard
  dashboard: {
    welcome: string
    subtitle: string
    actions: {
      registerFeelings: {
        title: string
        description: string
        button: string
      }
      viewProgress: {
        title: string
        description: string
        button: string
      }
      adminPanel: {
        title: string
        description: string
        button: string
      }
    }
    community: {
      title: string
      subtitle: string
      impactChart: {
        title: string
        description: string
      }
      activityChart: {
        title: string
        description: string
      }
    }
  }

  // Navegación
  navigation: {
    home: string
    dashboard: string
    statistics: string
    admin: string
    newRecord: string
    logout: string
  }

  // Formulario de Sentimientos
  feelingsForm: {
    title: string
    phase1: {
      title: string
      date: string
      beforeFeelings: string
      moodDescription: string
      nextButton: string
    }
    phase2: {
      title: string
      selectMeditation: string
      recommendations: string
      startMeditation: string
      backButton: string
      nextButton: string
    }
    phase3: {
      title: string
      afterFeelings: string
      postNotes: string
      backButton: string
      saveButton: string
    }
  }

  // Celebración
  celebration: {
    messages: string[]
    motivational: string[]
    continueButton: string
  }

  // Admin
  admin: {
    tabs: {
      analytics: string
      feelings: string
      meditations: string
      tags: string
      users: string
    }
    stats: {
      activeFeelings: string
      totalUsers: string
      totalRecords: string
      activeMeditations: string
    }
  }
}

export const translations: Record<Language, Translations> = {
  ES: {
    hero: {
      title: 'Mi Brújula Emocional - Meditación',
      subtitle: 'Rastrea tu estado de ánimo antes y después de meditar',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Registrarse'
    },
    features: {
      meditation: {
        title: 'Meditación Guiada',
        description: 'Registra tu estado antes y después de cada sesión de meditación'
      },
      analytics: {
        title: 'Análisis Personal',
        description: 'Visualiza tu progreso con gráficas detalladas de tu bienestar'
      },
      global: {
        title: 'Estudio Global',
        description: 'Participa en un estudio global sobre los beneficios de la meditación'
      }
    },
    auth: {
      login: {
        title: 'Iniciar Sesión',
        subtitle: 'Accede a tu cuenta de Mi Brújula Emocional',
        userId: 'ID de Usuario',
        password: 'Contraseña',
        loginButton: 'Iniciar Sesión',
        noAccount: '¿No tienes cuenta?',
        registerLink: 'Regístrate aquí'
      },
      register: {
        title: 'Registrarse',
        subtitle: 'Crea tu cuenta en Mi Brújula Emocional',
        userId: 'ID de Usuario',
        email: 'Email',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        country: 'País',
        language: 'Idioma',
        registerButton: 'Registrarse',
        hasAccount: '¿Ya tienes cuenta?',
        loginLink: 'Inicia sesión aquí'
      }
    },
    dashboard: {
      welcome: '¡Bienvenido',
      subtitle: 'Dashboard de Mi Brújula Emocional',
      actions: {
        registerFeelings: {
          title: 'Registrar Sentimientos',
          description: 'Registra cómo te sientes antes y después de meditar',
          button: 'Nuevo Registro'
        },
        viewProgress: {
          title: 'Ver Progreso',
          description: 'Revisa tu progreso y estadísticas de meditación',
          button: 'Ver Estadísticas'
        },
        adminPanel: {
          title: 'Panel de Administración',
          description: 'Gestiona sentimientos, usuarios y analíticas',
          button: 'Ir al Panel Admin'
        }
      },
      community: {
        title: 'Impacto de la Meditación en la Comunidad',
        subtitle: 'Mira cómo la meditación está transformando vidas cada día',
        impactChart: {
          title: 'Impacto Promedio en Sentimientos',
          description: 'Diferencia promedio entre antes y después de meditar'
        },
        activityChart: {
          title: 'Actividad Diaria en la Plataforma',
          description: 'Más personas están usando la herramienta cada día'
        }
      }
    },
    navigation: {
      home: 'Inicio',
      dashboard: 'Dashboard',
      statistics: 'Estadísticas',
      admin: 'Admin',
      newRecord: 'Nuevo Registro',
      logout: 'Cerrar Sesión'
    },
    feelingsForm: {
      title: 'Nuevo Registro de Sentimientos',
      phase1: {
        title: 'Fase 1: Estado Inicial',
        date: 'Fecha',
        beforeFeelings: '¿Cómo te sientes ANTES de meditar?',
        moodDescription: 'Descripción del estado de ánimo (opcional)',
        nextButton: 'Siguiente'
      },
      phase2: {
        title: 'Fase 2: Recomendaciones',
        selectMeditation: 'Seleccionar una meditación (opcional)',
        recommendations: 'Recomendaciones de Meditación',
        startMeditation: 'Comenzar Meditación',
        backButton: 'Atrás',
        nextButton: 'Siguiente'
      },
      phase3: {
        title: 'Fase 3: Estado Final',
        afterFeelings: '¿Cómo te sientes DESPUÉS de meditar?',
        postNotes: 'Notas post-meditación (opcional)',
        backButton: 'Atrás',
        saveButton: 'Guardar Registro'
      }
    },
    celebration: {
      messages: [
        "¡Has logrado tu primera meditación! 🎉",
        "¡Segunda meditación completada! ¡Vas muy bien! 🌟",
        "¡Tercera meditación! ¡Eres un experto! ✨",
        "¡Cuarta meditación! ¡Tu progreso es increíble! 🎊",
        "¡Quinta meditación! ¡Estás construyendo un hábito! 💪",
        "¡Sexta meditación! ¡Tu mente se está fortaleciendo! 🧠",
        "¡Séptima meditación! ¡Eres consistente! 🔥",
        "¡Octava meditación! ¡Tu bienestar mejora cada día! 🌈",
        "¡Novena meditación! ¡Casi llegas a la meta! 🎯",
        "¡Décima meditación! ¡Estás en el camino correcto! 🚀",
        "¡Undécima meditación! ¡Tu transformación es visible! 🌟",
        "¡Duodécima meditación! ¡Eres un ejemplo! 👑",
        "¡Decimotercera meditación! ¡Casi lo logras! 💎",
        "¡Decimocuarta meditación! ¡Una más para la meta! 🏆",
        "¡Decimoquinta meditación! ¡¡LO LOGRASTE!! 🎊🏅"
      ],
      motivational: [
        "Cada meditación es un paso hacia la paz interior",
        "Tu dedicación está transformando tu vida",
        "La consistencia es la clave del éxito",
        "Cada sesión fortalece tu mente y espíritu",
        "Estás creando un hábito que cambiará tu vida",
        "Tu progreso es inspirador",
        "La meditación es tu superpoder",
        "Cada respiración te acerca a la calma",
        "Tu bienestar mental es tu prioridad",
        "Estás construyendo un futuro más sereno",
        "Tu transformación interior es hermosa",
        "Eres un guerrero de la paz mental",
        "Tu dedicación es admirable",
        "Casi llegas a tu meta, ¡sigue así!",
        "¡Felicidades! Has completado tu meta de 15 meditaciones"
      ],
      continueButton: '¡Continuar!'
    },
    admin: {
      tabs: {
        analytics: 'Analíticas',
        feelings: 'Sentimientos',
        meditations: 'Meditaciones',
        tags: 'Etiquetas',
        users: 'Usuarios'
      },
      stats: {
        activeFeelings: 'Sentimientos Activos',
        totalUsers: 'Total de Usuarios',
        totalRecords: 'Total de Registros',
        activeMeditations: 'Meditaciones Activas'
      }
    }
  },
  EN: {
    hero: {
      title: 'My Emotional Map - Meditation',
      subtitle: 'Track your mood before and after meditation',
      loginButton: 'Login',
      registerButton: 'Register'
    },
    features: {
      meditation: {
        title: 'Guided Meditation',
        description: 'Record your state before and after each meditation session'
      },
      analytics: {
        title: 'Personal Analysis',
        description: 'Visualize your progress with detailed wellness charts'
      },
      global: {
        title: 'Global Study',
        description: 'Participate in a global study on meditation benefits'
      }
    },
    auth: {
      login: {
        title: 'Login',
        subtitle: 'Access your My Emotional Map account',
        userId: 'User ID',
        password: 'Password',
        loginButton: 'Login',
        noAccount: "Don't have an account?",
        registerLink: 'Register here'
      },
      register: {
        title: 'Register',
        subtitle: 'Create your My Emotional Map account',
        userId: 'User ID',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        country: 'Country',
        language: 'Language',
        registerButton: 'Register',
        hasAccount: 'Already have an account?',
        loginLink: 'Login here'
      }
    },
    dashboard: {
      welcome: 'Welcome',
      subtitle: 'My Emotional Map Dashboard',
      actions: {
        registerFeelings: {
          title: 'Register Feelings',
          description: 'Record how you feel before and after meditation',
          button: 'New Record'
        },
        viewProgress: {
          title: 'View Progress',
          description: 'Review your progress and meditation statistics',
          button: 'View Statistics'
        },
        adminPanel: {
          title: 'Admin Panel',
          description: 'Manage feelings, users and analytics',
          button: 'Go to Admin Panel'
        }
      },
      community: {
        title: 'Meditation Impact on Community',
        subtitle: 'See how meditation is transforming lives every day',
        impactChart: {
          title: 'Average Impact on Feelings',
          description: 'Average difference between before and after meditation'
        },
        activityChart: {
          title: 'Daily Activity on Platform',
          description: 'More people are using the tool every day'
        }
      }
    },
    navigation: {
      home: 'Home',
      dashboard: 'Dashboard',
      statistics: 'Statistics',
      admin: 'Admin',
      newRecord: 'New Record',
      logout: 'Logout'
    },
    feelingsForm: {
      title: 'New Feelings Record',
      phase1: {
        title: 'Phase 1: Initial State',
        date: 'Date',
        beforeFeelings: 'How do you feel BEFORE meditating?',
        moodDescription: 'Mood description (optional)',
        nextButton: 'Next'
      },
      phase2: {
        title: 'Phase 2: Recommendations',
        selectMeditation: 'Select a meditation (optional)',
        recommendations: 'Meditation Recommendations',
        startMeditation: 'Start Meditation',
        backButton: 'Back',
        nextButton: 'Next'
      },
      phase3: {
        title: 'Phase 3: Final State',
        afterFeelings: 'How do you feel AFTER meditating?',
        postNotes: 'Post-meditation notes (optional)',
        backButton: 'Back',
        saveButton: 'Save Record'
      }
    },
    celebration: {
      messages: [
        "You've achieved your first meditation! 🎉",
        "Second meditation completed! You're doing great! 🌟",
        "Third meditation! You're an expert! ✨",
        "Fourth meditation! Your progress is incredible! 🎊",
        "Fifth meditation! You're building a habit! 💪",
        "Sixth meditation! Your mind is getting stronger! 🧠",
        "Seventh meditation! You're consistent! 🔥",
        "Eighth meditation! Your wellness improves every day! 🌈",
        "Ninth meditation! Almost there! 🎯",
        "Tenth meditation! You're on the right track! 🚀",
        "Eleventh meditation! Your transformation is visible! 🌟",
        "Twelfth meditation! You're an example! 👑",
        "Thirteenth meditation! Almost there! 💎",
        "Fourteenth meditation! One more for the goal! 🏆",
        "Fifteenth meditation! YOU DID IT!! 🎊🏅"
      ],
      motivational: [
        "Each meditation is a step towards inner peace",
        "Your dedication is transforming your life",
        "Consistency is the key to success",
        "Each session strengthens your mind and spirit",
        "You're creating a habit that will change your life",
        "Your progress is inspiring",
        "Meditation is your superpower",
        "Each breath brings you closer to calm",
        "Your mental wellness is your priority",
        "You're building a more serene future",
        "Your inner transformation is beautiful",
        "You're a warrior of mental peace",
        "Your dedication is admirable",
        "Almost at your goal, keep going!",
        "Congratulations! You've completed your 15 meditation goal"
      ],
      continueButton: 'Continue!'
    },
    admin: {
      tabs: {
        analytics: 'Analytics',
        feelings: 'Feelings',
        meditations: 'Meditations',
        tags: 'Tags',
        users: 'Users'
      },
      stats: {
        activeFeelings: 'Active Feelings',
        totalUsers: 'Total Users',
        totalRecords: 'Total Records',
        activeMeditations: 'Active Meditations'
      }
    }
  }
}

export function getTranslation(language: Language): Translations {
  return translations[language]
}
