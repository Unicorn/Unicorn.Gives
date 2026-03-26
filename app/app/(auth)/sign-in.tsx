import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { routes } from '@/lib/navigation';

export default function SignInScreen() {
  const { signIn, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace(routes.home());
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error } = await signInWithMagicLink(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
  }

  if (magicLinkSent) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a magic link to {email}. Click the link in the email to sign in.
        </Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setMagicLinkSent(false)}
        >
          <Text style={styles.linkText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome back to Unicorn Gives</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fcf9f4" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleMagicLink}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Send Magic Link</Text>
      </TouchableOpacity>

      <Link href={routes.auth.signUp()} asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fcf9f4',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d4a4a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#43493e',
    marginBottom: 32,
  },
  error: {
    color: '#c44',
    fontSize: 14,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fde',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c3c8bb',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#43493e',
  },
  button: {
    backgroundColor: '#2d4a4a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fcf9f4',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d4a4a',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#2d4a4a',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    padding: 8,
  },
  linkText: {
    color: '#43493e',
    fontSize: 14,
  },
  linkBold: {
    fontWeight: '700',
    color: '#2d4a4a',
  },
});
