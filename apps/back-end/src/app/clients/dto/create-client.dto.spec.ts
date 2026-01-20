import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateClientDto } from './create-client.dto';

describe('CreateClientDto - Validação', () => {
  describe('email', () => {
    it('deve rejeitar email com formato inválido', async () => {
      const invalidEmails = [
        'email-sem-arroba',
        '@semdominio.com',
        'semdominio@',
        'email..com@example.com',
        'email @example.com',
        'email@',
        'email@example',
        'email@@example.com',
        'email.com',
        '',
        ' ',
        'email@.com',
        '@example.com',
        'email@example..com',
      ];

      for (const invalidEmail of invalidEmails) {
        const dto = plainToClass(CreateClientDto, {
          nome: 'João Silva',
          email: invalidEmail,
          telefone: '+55 11 98765-4321',
        });

        const errors = await validate(dto);
        const emailError = errors.find((error) => error.property === 'email');

        expect(emailError).toBeDefined();
        expect(emailError?.constraints).toBeDefined();
        expect(
          emailError?.constraints?.['isEmail'] ||
            emailError?.constraints?.['isNotEmpty']
        ).toBeDefined();
      }
    });

    it('deve aceitar emails com formato válido', async () => {
      const validEmails = [
        'joao@example.com',
        'joao.silva@example.com',
        'joao_silva@example.com',
        'joao123@example.com',
        'joao+tag@example.com',
        'joao@example.co.uk',
        'joao@subdomain.example.com',
        'joao-silva@example.com',
        'joao.silva.santos@example.com',
        'test.email+tag@example.co.uk',
      ];

      for (const validEmail of validEmails) {
        const dto = plainToClass(CreateClientDto, {
          nome: 'João Silva',
          email: validEmail,
          telefone: '+55 11 98765-4321',
        });

        const errors = await validate(dto);
        const emailError = errors.find((error) => error.property === 'email');

        expect(emailError).toBeUndefined();
      }
    });

    it('deve rejeitar email vazio', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 'João Silva',
        email: '',
        telefone: '+55 11 98765-4321',
      });

      const errors = await validate(dto);
      const emailError = errors.find((error) => error.property === 'email');

      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.['isNotEmpty']).toBeDefined();
    });

    it('deve rejeitar email quando não fornecido', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 'João Silva',
        telefone: '+55 11 98765-4321',
        // email não fornecido
      });

      const errors = await validate(dto);
      const emailError = errors.find((error) => error.property === 'email');

      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.['isNotEmpty']).toBeDefined();
    });
  });

  describe('nome', () => {
    it('deve rejeitar nome vazio', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: '',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      });

      const errors = await validate(dto);
      const nomeError = errors.find((error) => error.property === 'nome');

      expect(nomeError).toBeDefined();
      expect(nomeError?.constraints?.['isNotEmpty']).toBeDefined();
    });

    it('deve rejeitar nome quando não fornecido', async () => {
      const dto = plainToClass(CreateClientDto, {
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
        // nome não fornecido
      });

      const errors = await validate(dto);
      const nomeError = errors.find((error) => error.property === 'nome');

      expect(nomeError).toBeDefined();
      expect(nomeError?.constraints?.['isNotEmpty']).toBeDefined();
    });

    it('deve aceitar nome válido', async () => {
      const validNomes = [
        'João Silva',
        'Maria Santos',
        'José da Silva',
        'Ana Paula',
        'Pedro Henrique',
      ];

      for (const nome of validNomes) {
        const dto = plainToClass(CreateClientDto, {
          nome,
          email: 'joao@example.com',
          telefone: '+55 11 98765-4321',
        });

        const errors = await validate(dto);
        const nomeError = errors.find((error) => error.property === 'nome');

        expect(nomeError).toBeUndefined();
      }
    });

    it('deve rejeitar nome que não seja string', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 123 as any, // Forçar tipo incorreto
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      });

      const errors = await validate(dto);
      const nomeError = errors.find((error) => error.property === 'nome');

      expect(nomeError).toBeDefined();
      expect(nomeError?.constraints?.['isString']).toBeDefined();
    });
  });

  describe('telefone', () => {
    it('deve rejeitar telefone vazio', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '',
      });

      const errors = await validate(dto);
      const telefoneError = errors.find(
        (error) => error.property === 'telefone'
      );

      expect(telefoneError).toBeDefined();
      expect(telefoneError?.constraints?.['isNotEmpty']).toBeDefined();
    });

    it('deve rejeitar telefone quando não fornecido', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 'João Silva',
        email: 'joao@example.com',
        // telefone não fornecido
      });

      const errors = await validate(dto);
      const telefoneError = errors.find(
        (error) => error.property === 'telefone'
      );

      expect(telefoneError).toBeDefined();
      expect(telefoneError?.constraints?.['isNotEmpty']).toBeDefined();
    });

    it('deve aceitar telefone válido', async () => {
      const validTelefones = [
        '+55 11 98765-4321',
        '(11) 98765-4321',
        '11987654321',
        '+5511987654321',
        '11 98765-4321',
      ];

      for (const telefone of validTelefones) {
        const dto = plainToClass(CreateClientDto, {
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone,
        });

        const errors = await validate(dto);
        const telefoneError = errors.find(
          (error) => error.property === 'telefone'
        );

        expect(telefoneError).toBeUndefined();
      }
    });
  });

  describe('validação completa', () => {
    it('deve aceitar DTO válido completo', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '+55 11 98765-4321',
      });

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('deve rejeitar DTO com todos os campos inválidos', async () => {
      const dto = plainToClass(CreateClientDto, {
        nome: '',
        email: 'email-invalido',
        telefone: '',
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.find((e) => e.property === 'nome')).toBeDefined();
      expect(errors.find((e) => e.property === 'email')).toBeDefined();
      expect(errors.find((e) => e.property === 'telefone')).toBeDefined();
    });
  });
});
