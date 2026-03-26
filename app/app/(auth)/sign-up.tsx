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
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { routes } from '@/lib/navigation';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignUp() {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error } = await signUp(email, password, displayName || undefined);
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a confirmation link to {email}. Click the link to verify your account.
        </Text>
        <Link href={routes.auth.signIn()} asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Unicorn Gives community</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Display Name (optional)"
        value={displayName}
        onChangeText={setDisplayName}
        autoComplete="name"
      />

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
        autoComplete="new-password"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fcf9f4" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <Link href={routes.auth.signIn()} asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Sign in</Text>
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
    marginBottom: 24,
  },
  buttonText: {
    color: '#fcf9f4',
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
