import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LaunchScreen from './LaunchScreen';
import LoginScreen from './UserManagement/Login';
import StudentRegister from './UserManagement/StudentRegister';

import AddClass from './SubjectManagement/AddClass';
import ViewClasses from './SubjectManagement/ViewClasses';
import SearchLessons from './SubjectManagement/SearchLessons';
import UpdateClass from './SubjectManagement/UpdateClass';
import ClassDetails from './SubjectManagement/ClassDetails';
import Menu from './SubjectManagement/Menu';
import Dashboard from './SubjectManagement/Dashboard';
import TeaLogin from './SubjectManagement/TeaLogin';
import ViewStudents from './SubjectManagement/ViewStudents';

import UserFeedback from './UserFeedback/UserFeedback';
import ManagerRegister from './Manager/ManagerRegister';
import ManagerDashboard from './Manager/ManageDashboard';
import StudentManagement from './Manager/StudentsManagement';
import TeachersManagement from './Manager/TeachersManagement';
import { UserProvider } from '../hooks/UserContext';
import NearbyClassView from './ClassManagement/NearbyClassView';
// import AddClass from './ClassManagement/AddClass';
import HomeScreen from './homeScreen';
import AttendenceMark from './AttendenceManagement/attendenceMark';
import StudentAttend from './StudentManagement/studentAttend';
import ParentNotification from './ParentManagement/parentNotification';
import AttendanceReport from './AttendenceManagement/attendanceReport';
import AddStudents from './Manager/AddStudents';
import AddTeachers from './Manager/AddTeachers';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <Stack.Navigator
        initialRouteName='Launch'
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: Colors.light.accent,
          },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold', },
        })}
      >

        <Stack.Screen name="Launch" component={LaunchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentRegister" component={StudentRegister} options={{ title: 'Student Registration' }} />

        {/*Subject Management*/}
        {/* <Stack.Screen name="AddClass" component={AddClass} options={{ headerShown: false }} /> */}
        <Stack.Screen name="ViewClasses" component={ViewClasses} options={{ headerShown: false }} />
        <Stack.Screen name="SearchLessons" component={SearchLessons} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateClass" component={UpdateClass} options={{ headerShown: false }} />
        <Stack.Screen name="ClassDetails" component={ClassDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="TeaLogin" component={TeaLogin} options={{ headerShown: false }} />
        <Stack.Screen name="ViewStudents" component={ViewStudents} options={{ headerShown: false }} />

        <Stack.Screen name="NearbyClasses" component={NearbyClassView} options={{ title: 'Nearby Classes' }} />
        <Stack.Screen name="AddClass" component={AddClass} options={{ title: 'Add Class' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EduSmart Home' }} />
        <Stack.Screen name="MarkAttendance" component={AttendenceMark} options={{ title: 'Mark Attendance' }} />
        <Stack.Screen name="StudentAttend" component={StudentAttend} options={{ title: 'Scan Attendance' }} />
        <Stack.Screen name="ParentNotification" component={ParentNotification} options={{ title: 'Parent Notifications' }} />
        <Stack.Screen name="AttendanceReport" component={AttendanceReport} options={{ title: 'Attendance Report' }} />

        {/* prasad added */}
        <Stack.Screen name="UserFeedback" component={UserFeedback} options={{ headerShown: false, }} />
        <Stack.Screen name="ManagerRegister" component={ManagerRegister} options={{ headerShown: false, }} />
        <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} options={{ headerShown: false, }} />
        <Stack.Screen name="StudentManagement" component={StudentManagement} options={{ headerShown: false, }} />
        <Stack.Screen name="TeachersManagement" component={TeachersManagement} options={{ headerShown: false, }} />
        <Stack.Screen name="AddStudents" component={AddStudents} options={{ headerShown: false, }} />
        <Stack.Screen name="AddTeachers" component={AddTeachers} options={{ headerShown: false, }} />
      </Stack.Navigator>
    </UserProvider>
  );
}

