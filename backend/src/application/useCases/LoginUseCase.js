
class LoginUseCase {
  constructor(userRepository, passwordAuth, jwtService) {
    this.userRepository = userRepository
    this.passwordAuth = passwordAuth
    this.jwtService = jwtService
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios')
    }

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    const isPasswordValid = await this.passwordAuth.comparePassword(
      password, 
      user.password
    );

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas')
    }

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Remove password do retorno
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    };
  }
}

module.exports = LoginUseCase;