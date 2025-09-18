'use client';
import {useState} from 'react';
import {z} from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signUp,signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Icons } from '../icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const registerSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters long'),
    email: z.string().email({message:'Please enter a valid email address'}),
    password: z.string().min(6,'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6,'Confirm Password must be at least 6 characters long'),
}).refine((data)=>data.password===data.confirmPassword,{
    message:'Passwords do not match',
    path:['confirmPassword'],
});
type RegisterFormValues=z.infer<typeof registerSchema>;

interface RegisterFormProps{
}

export default function RegisterForm({}: RegisterFormProps) {
    const router = useRouter();
    const [isLoading,setIsLoading]=useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            name:'',
            email:'',
            password:'',
            confirmPassword:''
        }
    });

   // In your register-form.tsx
const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
  
      if (error) {
        toast.error(error.message);
        return;
      }
  
      // Show success message and redirect to verification request page
      toast.success('Account created successfully. Please login.');
      router.push('/login?registered=true');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };
      

    const handleGoogleSignUp = async () => {
        try {
            setIsGoogleLoading(true);
            const { error } = await signIn.social({
                provider: "google",
                callbackURL: "/",
              });
            if (error) throw error;
            // onSuccess will be called automatically after successful social sign up
        } catch (error) {
            console.error('Google sign up failed:', error);
            toast.error('Failed to sign up with Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField 
                    control={form.control}
                    name='name'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    type='text' 
                                    placeholder='Enter your name' 
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name='email'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input 
                                    type='email' 
                                    placeholder='Enter your email' 
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name='password'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input 
                                    type='password' 
                                    placeholder='Enter your password' 
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField 
                    control={form.control}
                    name='confirmPassword'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input 
                                    type='password' 
                                    placeholder='Confirm your password' 
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className='w-full' disabled={isLoading}>
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or sign up with
                    </span>
                </div>
            </div>

            <Button 
                variant="outline" 
                type="button" 
                className="w-full"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isLoading}
            >
                {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}
                Google
            </Button>
            <div className="flex items-center justify-center">
                Already have an account? <Link href="/login" className="ml-2 text-blue-500">Login</Link>
            </div>
        </div>
    );
}