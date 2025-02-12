import { DeviceData, useGetDevices } from '@/utils/hooks/useGetDevices'
import MapLocation from './componetns/MapLocation'
import { DoubleSidedImage, Loading } from '@/components/shared'
import { useParams } from 'react-router-dom'
import DeviceSpecifics from './componetns/DeviceSpecifics'
import UserInfo from './componetns/UserInfo'
import { useEffect, useState } from 'react'
import {
    apiGetAllDevices,
    apiGetDeviceLogByEncryptedIdAndNumberOfDays,
    apiGetDevices,
} from '@/services/DeviceApi'
import {
    apiGetCurUserProfile,
    apiGetUserProfileByUserId,
} from '@/services/UserApi'
import Chart from '@/views/account/Settings/components/ReChart'
import { Card, DatePicker } from '@/components/ui'
import { useAppSelector } from '@/store'
import Table2D from '@/views/account/Settings/components/Table2D'
import { convertToTimeZone } from '@/views/account/Settings/components/TimeZone'

export function convertToUserTimeZone(isoDateString: string) {
    // Create a Date object from the ISO 8601 string
    const date = new Date(isoDateString)

    // Format the date in the user's local time zone
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3, // To include milliseconds
        timeZoneName: 'short',
    } as Object

    // Create a formatter with the user's local time zone
    const formatter = new Intl.DateTimeFormat(undefined, options)

    // Format the date
    const formattedDate = formatter.format(date)

    return formattedDate
}

function DeviceDetails() {
    const [data, setData] = useState<DeviceData>()
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState('') as any
    const [logLoading, setLogLoading] = useState(false) as any
    const [chartData, setChartData] = useState([]) as any
    const [tablesData, setTablesData] = useState([]) as any
    const { _id: userId } = useAppSelector((state) => state.auth.user)
    const { deviceId } = useParams()

    useEffect(() => {
        async function fetchUsers() {
            const response = await apiGetAllDevices()
            const data = response.data as any
            const deviceData = data.data.filter(
                (device: any) => device._id === deviceId
            )[0] as DeviceData
            
            setData(deviceData)
            const resData = (await apiGetUserProfileByUserId(
                deviceData.userId
            )) as any
            setProfileData(resData.data.data)
            setLoading(false)
            await changeLogDatas(0, deviceData, resData.data.data)
        }
        fetchUsers()
    }, [])

    if (loading === true) return <Loading loading={true} />

    if (loading === false && !data)
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <DoubleSidedImage
                    src="/img/others/img-2.png"
                    darkModeSrc="/img/others/img-2-dark.png"
                    alt="No product found!"
                />
                <h3 className="mt-8">No device found!</h3>
            </div>
        )

    async function changeLogDatas(
        days = 0,
        deviceData: any = null,
        profData: any = null
    ) {
        setLogLoading(true)
        let encryptId = ''
        if (deviceData) {
            encryptId = deviceData?.deviceEncryptedId
        } else {
            encryptId = data?.deviceEncryptedId || ''
        }
        const logRes = (await apiGetDeviceLogByEncryptedIdAndNumberOfDays(
            encryptId,
            days
        )) as any

        let tempChartData = logRes.data?.data

        let allTempDatas: any = {
            chart: [],
            motion: [],
            button: [],
            door: [],
        }

        tempChartData.map((item: any) => {
            let userDate = new Date()

            if (profData && profData.timezone) {
                userDate = new Date(
                    convertToTimeZone(item.insertDate, profData.timezone)
                )
            } else {
                userDate = new Date(convertToUserTimeZone(item.insertDate))
            }

            const hours = userDate.getHours().toString().padStart(2, '0')
            const minutes = userDate.getMinutes().toString().padStart(2, '0')

            if (item.data?.Temperature && item.data?.Humidity) {
                allTempDatas.chart.push({
                    insertDate: `${hours}:${minutes}`,
                    Temperature: item.data?.Temperature || '',
                    Humidity: item.data?.Humidity || '',
                })
            } else {
                allTempDatas.chart.push({
                    insertDate: `${hours}:${minutes}`,
                })
            }

            if (item.data?.Button && item.data?.Button === 'Pressed') {
                allTempDatas.button.push({
                    Time: `${hours}:${minutes}`,
                    Button: item.data?.Button || '',
                })
            }

            if (item.data?.Movement && item.data?.Movement === 'Detected') {
                allTempDatas.motion.push({
                    Time: `${hours}:${minutes}`,
                    Movement: item.data?.Movement || '',
                })
            }

            if (item.data?.Door) {
                allTempDatas.door.push({
                    Time: `${hours}:${minutes}`,
                    Door: item.data?.Door || '',
                })
            }
        })

        setChartData(allTempDatas)
        setLogLoading(false)
    }

    function handleDateChange(date: Date) {
        const selectedDate = new Date(date)
        const nowDate = new Date()
        const timeDifference = nowDate.getTime() - selectedDate.getTime()
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        changeLogDatas(daysDifference)
    }

    if (loading === false && data)
        return (
            <div className="flex flex-col w-full">
                {/* <div className="card card-border">
                    <MapLocation />
                </div>  */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="card w-full card-border col-span-1">
                        <UserInfo profileData={profileData} />
                    </div>
                    <div className="card card-border col-span-1">
                        <DeviceSpecifics data={data} />
                    </div>
                </div>
                <Card
                    bodyClass="flex flex-col gap-10 py-10"
                    className=" w-full min-h-[65dvh] mt-10 card card-border"
                >
                    <h1 className="ms-10">Device Log</h1>
                    <div className="flex px-10">
                        <DatePicker
                            disabled={logLoading}
                            onChange={handleDateChange as any}
                            maxDate={new Date()}
                            minDate={new Date('2023/1/1')}
                            clearable={false}
                            defaultValue={new Date()}
                        />
                    </div>
                    {(logLoading && (
                        <div className="flex items-center justify-center w-full h-[40dvh]">
                            <Loading loading={true} />
                        </div>
                    )) || <Chart data={chartData.chart} loading={logLoading} />}
                </Card>

                {logLoading == false &&
                    (chartData?.door.length !== 0 ||
                        chartData?.motion.length !== 0 ||
                        chartData?.button.length !== 0) && (
                        <Card
                            bodyClass="flex h-full justify-center px-5 gap-5 py-10"
                            className="w-full min-h-[65dvh] mt-10 card card-border"
                        >
                            {(logLoading && <Loading loading={true} />) || (
                                <>
                                    {chartData?.button &&
                                        chartData?.button.length > 0 && (
                                            <div className="w-1/3 h-full">
                                                <Table2D
                                                    data={chartData.button}
                                                    rowsPerPage={10}
                                                />
                                            </div>
                                        )}
                                    {chartData?.motion &&
                                        chartData?.motion.length > 0 && (
                                            <div className="w-1/3 h-full">
                                                <Table2D
                                                    data={chartData?.motion}
                                                    rowsPerPage={10}
                                                />
                                            </div>
                                        )}
                                    {chartData?.door &&
                                        chartData?.door.length > 0 && (
                                            <div className="w-1/3 h-full">
                                                <Table2D
                                                    data={chartData?.door}
                                                    rowsPerPage={10}
                                                />
                                            </div>
                                        )}
                                </>
                            )}
                        </Card>
                    )}
            </div>
        )
}

export default DeviceDetails
