import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { APP_NAME } from '@/constants/app.constant'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import packageJson from '@/../package.json';

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    return (
        <div className="flex items-center justify-between flex-auto w-full">
            <span>
                &copy; {`${new Date().getFullYear()}`}{' '}
                <span className="font-semibold">{`${APP_NAME}`}</span>. All
                rights reserved. (v{packageJson.version})
            </span>
            <div className="">
                <a
                    className="text-gray"
                    target='_blank'
                    href="https://fidesinnova.io/privacy/"
                >
                    Privacy & Policy
                </a>
            </div>
        </div>
    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
