import { SubmitHandler, useForm } from 'react-hook-form'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const loginSchema = z.object({
    phone: z.string().length(10, 'Номер телефону повинен містити 10 символів').refine((value) => /^\d+$/.test(value), {
      message: 'Номер телефону може містити лише цифри',
    }),
    password: z.string().min(7, 'Пароль повинен містити не менше 7 символів').max(100, 'Пароль занадто довгий'),
  });
  

type LoginSchema = z.infer<typeof loginSchema>

function Login() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting, errors },
      } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) })
      
    const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
        try {
            loginSchema.parse(data);
            const form = {
                password: data.password,
                numberOfPhone: data.phone,
            };
            const response = await axios.post("http://localhost:5000/auth/login", form);
            console.log('Данные успешно отправлены:', response.data);
            navigate('/dashboard');
          } catch (error) {
            alert('Произошла ошибка при отправке данных: ' + error);
          }
    };

    return (
        <section className='bg-gray-50'>
            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
                <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
                    <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                        <h1 className='title'>Вхід в аккаунт</h1>
                        <form className='space-y-7' onSubmit={handleSubmit(onSubmit)}>
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
                            <div>
                                <label htmlFor='password' className='label'>
                                Пароль *
                                </label>
                                <input
                                {...register('password')}
                                type='password'
                                id='password'
                                placeholder='Не менше 7 символів'
                                className='input'
                                aria-invalid={errors.password ? 'true' : 'false'}
                                />
                                {errors.password && (
                                <span role='alert' className='error'>
                                    {errors.password?.message}
                                </span>
                                )}
                            </div>
                            <div className='flex gap-5 justify-center pt-2'>
                                <button
                                type='submit'
                                className='btn btn-primary'
                                disabled={!isDirty || isSubmitting}
                                >
                                Увійти
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

export default Login;