import { Dialog, Button, Input } from '@/components/ui'

interface LocalShareDeviceDialogProps {
    isOpen: boolean
    onClose: () => void
    onCheckUser: () => void
    onShare: () => void
    userIsExist: boolean
    loading: boolean
    deviceName: string
    userEmail: string
    setUserEmail: (email: string) => void
}

const LocalShareDeviceDialog: React.FC<LocalShareDeviceDialogProps> = ({
    isOpen,
    onClose,
    onCheckUser,
    onShare,
    userIsExist,
    loading,
    deviceName,
    userEmail,
    setUserEmail,
}) => {
    return (
        <Dialog
            overlayClassName={'flex items-center'}
            isOpen={isOpen}
            closable={false}
            contentClassName="!w-1/3 flex flex-col gap-6"
            onClose={onClose}
        >
            <h3>Local Share Device</h3>
            <p className="text-left text-[1.1rem]">
                {userIsExist
                    ? 'By locally sharing the device with this user, you are granting access to view your device logs and details. Please ensure you trust this user before proceeding.'
                    : `Enter the email of the user you want to share the '${deviceName}' device with locally.`}
            </p>
            <Input
                type="email"
                value={userEmail}
                disabled={userIsExist}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (userIsExist) {
                            onShare()
                        } else {
                            onCheckUser()
                        }
                    }
                }}
                onChange={(e) =>
                    setUserEmail(e.target.value.replace(/\s/g, ''))
                }
                placeholder="User email..."
            />

            <div className="flex w-2/3 mx-auto justify-between">
                <Button
                    onClick={userIsExist ? onShare : onCheckUser}
                    loading={loading}
                    variant="solid"
                    color={userIsExist ? 'green-500' : 'yellow-500'}
                >
                    {userIsExist ? 'Share' : 'Check user'}
                </Button>
                <Button onClick={onClose} variant="default" loading={loading}>
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}

export default LocalShareDeviceDialog
