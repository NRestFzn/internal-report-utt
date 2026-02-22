import {createClient} from '@/lib/supabase/client';
import {LoginSchema} from '../types';

const supabase = createClient();

export async function loginAdmin(values: LoginSchema) {
  const {data: authData, error: authError} =
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Login failed');
  }

  const user = authData.user;

  const {data: profile, error: profileError} = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error('Gagal mengambil data profil admin.');
  }

  const roleName = Array.isArray(profile?.roles)
    ? profile?.roles[0]?.name?.toLowerCase()
    : (profile?.roles as any)?.name?.toLowerCase();

  if (roleName !== 'admin') {
    await supabase.auth.signOut();
    throw new Error(
      'Access Denied. Akun ini tidak memiliki otorisasi sebagai Admin.',
    );
  }

  return {user, role: roleName};
}
