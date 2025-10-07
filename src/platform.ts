export enum Runtime {
    UnknownRuntime = "Unknown",
    Windows_86 = "Windows_86",
    Windows_64 = "Windows_64",
    Windows_ARM64 = "Windows_ARM64",
    OSX_10_11_64 = "OSX_10_11_64",
    OSX_ARM64 = "OSX_ARM64",
    CentOS_7 = "CentOS_7",
    Debian_8 = "Debian_8",
    Fedora_23 = "Fedora_23",
    OpenSUSE_13_2 = "OpenSUSE_13_2",
    SLES_12_2 = "SLES_12_2",
    RHEL_7 = "RHEL_7",
    Ubuntu_14 = "Ubuntu_14",
    Ubuntu_16 = "Ubuntu_16",
    Linux_ARM64 = "Linux_ARM64",
}


export function getRuntimeDisplayName(runtime: Runtime): string {
    switch (runtime) {
        case Runtime.Windows_64:
        case Runtime.Windows_86:
        case Runtime.Windows_ARM64:
            return "Windows";
        case Runtime.OSX_10_11_64:
        case Runtime.OSX_ARM64:
            return "OSX";
        case Runtime.CentOS_7:
            return "CentOS";
        case Runtime.Debian_8:
            return "Debian";
        case Runtime.Fedora_23:
            return "Fedora";
        case Runtime.OpenSUSE_13_2:
            return "OpenSUSE";
        case Runtime.SLES_12_2:
            return "SLES";
        case Runtime.RHEL_7:
            return "RHEL";
        case Runtime.Ubuntu_14:
            return "Ubuntu14";
        case Runtime.Ubuntu_16:
            return "Ubuntu16";
        case Runtime.Linux_ARM64:
            return "Linux";
        default:
            return "Unknown";
    }
}