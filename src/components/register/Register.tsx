import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const registerSchema = z.object({
  username: z.string()
    .min(11, {message: 'Ім’я користувача занадто коротке'})
    .max(500, 'Ім’я користувача занадто довге'),
  age: z.number()
    .min(18, {message: 'Має бути не менше 18 років'})
    .max(80, 'Має бути не більше 80 років'),
  email: z.string().min(5).max(1000).email("Некоректний email"),
  phone: z.string().length(10, 'Номер телефону повинен містити 10 символів'),
  password: z.string().min(7, "Пароль повинен містити не менше 7 символів"),
  confirmPassword: z.string().min(7, "Підтвердіть пароль"),
  terms: z.literal(true, {
    errorMap: () => ({message: 'Прийміть умови використання'}),
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Введені паролі не співпадають',
})


type RegisterSchema = z.infer<typeof registerSchema>

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) })

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    try {
        registerSchema.parse(data);
        const form = {
            username: data.username,
            password: data.password,
            numberOfPhone: data.phone,
            age: data.age,
            email: data.email
        };
        const response = await axios.post("http://localhost:5000/auth/register", form);
        console.log('Данные успешно отправлены:', response.data);
        navigate('/login');
      } catch (error) {
        alert('Произошла ошибка при отправке данных: ' + error);
      }
  }

  useEffect(() => {
    setFocus('username')
  }, [])

  return (
    <section className='bg-gray-50'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='title'>Створення аккаунта</h1>
            <form className='space-y-7' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label htmlFor='username' className='label'>
                  Ім'я користувача *
                </label>
                <input
                  {...register('username')}
                  type='text'
                  id='username'
                  className='input'
                  placeholder='Ваше имя'
                  aria-invalid={errors.username ? 'true' : 'false'}
                />
                  {errors.username && (
                    <span role='alert' className='error'>
                      {errors.username?.message}
                    </span>
                  )}
              </div>
              <div className='mb-4'>
                <label htmlFor='phone' className='label'>
                  Номер телефону *
                </label>
                <input
                  {...register('phone')}
                  type='tel'  
                  id='phone'
                  className='input'
                  placeholder='Номер телефону'
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
                {errors.phone && (
                  <span role='alert' className='error'>
                    {errors.phone?.message}
                  </span>
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='age' className='label'>
                  Вік
                </label>
                <input
                  {...register('age', {
                    setValueAs: (v) => Number(v),
                  })}
                  type='number'
                  id='age'
                  className='input'
                  placeholder='От 18 до 65 лет'
                  aria-invalid={errors.age ? 'true' : 'false'}
                />
                  {errors.age && (
                    <span role='alert' className='error'>
                      {errors.age?.message}
                    </span>
                  )}
              </div>
              <div>
                <label htmlFor='email' className='label'>
                  Адрес електронної пошти *
                </label>
                <input
                  {...register('email')}
                  type='email'
                  id='email'
                  className='input'
                  placeholder='name@mail.com'
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                  {errors.email && (
                    <span role='alert' className='error'>
                      {errors.email?.message}
                    </span>
                  )}
              </div>
              <div>
                <label htmlFor='password' className='label'>
                  Пароль *
                </label>
                <input
                  {...register('password')}
                  type='password'
                  id='password'
                  placeholder='Не менее 6 символов'
                  className='input'
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                  {errors.password && (
                    <span role='alert' className='error'>
                      {errors.password?.message}
                    </span>
                  )}
              </div>
              <div>
                <label htmlFor='confirmPassword' className='label'>
                  Підтвердження пароля *
                </label>
                <input
                  {...register('confirmPassword')}
                  type='password'
                  id='confirmPassword'
                   placeholder='Не менее 6 символов'
                  className='input'
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                  {errors.confirmPassword && (
                    <span role='alert' className='error'>
                      {errors.confirmPassword?.message}
                    </span>
                  )}
              </div>
              <div className='flex items-center relative'>
                <input
                  {...register('terms')}
                  id='terms'
                  aria-describedby='terms'
                  type='checkbox'
                  className='w-4 h-4 border border-gray-300 bg-gray-50 accent-primary-500 focus:outline-2 focus:outline-primary-500 outline-none'
                  aria-invalid={errors.terms ? 'true' : 'false'}
                />
                <label
                  htmlFor='terms'
                  className='font-light text-gray-500 text-sm ml-3 cursor-pointer select-none'
                >
                  Я приймаю{' '}
                  <a
                    className='font-medium text-primary-500 hover:text-primary-700 focus:text-primary-700 transition-colors outline-none'
                    href='#'
                  >
                    Умови використання
                  </a>
                </label>
                {errors.terms && (
                  <span className='error top-5'>{errors.terms?.message}</span>
                )}
              </div>
              <div className='flex gap-5 justify-center pt-2'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={!isDirty || isSubmitting}
                >
                  Створити акаунт
                </button>
                <button
                  type='button'
                  className='btn btn-error'
                  disabled={!isDirty || isSubmitting}
                  onClick={() => reset()}
                >
                  Очистити поля
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register