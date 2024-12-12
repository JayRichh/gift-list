import { Container } from '~/components/ui/Container'
import { Text } from '~/components/ui/Text'
import { Spinner } from '~/components/ui/Spinner'

export default function ResetPasswordLoading() {
  return (
    <Container className="max-w-md py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Text className="text-2xl font-bold">Reset Password</Text>
          <Text className="text-foreground/60">
            Enter your new password below
          </Text>
        </div>

        <div className="flex items-center justify-center min-h-[200px]">
          <Spinner size="lg" variant="primary" />
        </div>
      </div>
    </Container>
  )
}
