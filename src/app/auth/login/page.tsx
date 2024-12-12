import { AuthForm } from '~/components/auth/AuthForm'
import { Text } from '~/components/ui/Text'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string }
}) {
  const { error, error_description } = searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {error && (
          <div className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5">
            <Text className="text-sm text-destructive">
              {error === 'access_denied' && error_description?.includes('expired')
                ? 'The confirmation link has expired. Please request a new one by trying to sign in.'
                : error_description || 'An error occurred during authentication'}
            </Text>
          </div>
        )}
        <AuthForm mode="signin" />
      </div>
    </div>
  )
}
