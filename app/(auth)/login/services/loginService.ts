import {createClient} from '@/lib/supabase/client';
import {LoginSchema} from '../types';

const supabase = createClient();

export async function loginUser(values: LoginSchema) {
  const {data: authData, error: authError} =
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  const user = authData.user;

  const {data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error('Failed to get user profile.');
  }

  const roleName = Array.isArray(profile?.roles)
    ? profile?.roles[0]?.name
    : (profile?.roles as any)?.name;

  if (roleName === 'admin') {
    await supabase.auth.signOut();
    throw new Error('Invalid credentials.');
  }

  return {user, role: roleName};
}
