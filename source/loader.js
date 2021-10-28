function loadSetup(file) {
    if (!isNewFile(file)) {
        loadSetupOld(file);
        return false;
    }

    // implement new loading system
}

function isNewFile(file) {
    return false;
    try {
        JSON.parse(file)
        return true;
    }
    catch {
        return false;
    }
}

function loadSetupOld(file) {
    const n = (value) => Number(value.replace(',', '.'));
    let reader = new FileReader();

    reader.onload = function (progressEvent) {
        let lines = this.result.split('\n');
        if (lines.length < 186) {
            alert('File not valid!');
            return false;
        }

        pauseMovement(true);

        //lines[1], lines[2] // LokacijaSredstva (???)
        player.reset();
        player.setPosition(n(lines[3]), n(lines[4])); // aircraft position
        NDB.setPosition(n(lines[5]), n(lines[6])); // NDB position
        player.angle = n(lines[26]);          // Aircraft rotation 
        instrHSI.setCRSAngle(n(lines[27]));          // HSI arrow angle
        instrCDI.setOBSAngle(n(lines[29]));          // CDI arrow angle
        VORa.setPosition(n(lines[35]), n(lines[36])); // VORa position
        VORb.setPosition(n(lines[37]), n(lines[38])); // VORb position

        instrRMI.setPosition(n(lines[39]), n(lines[40])); // RMI position
        instrDG.setPosition(n(lines[45]), n(lines[46]));  // DG position
        instrRBI.setPosition(n(lines[49]), n(lines[50])); // RBI position
        instrHSI.setPosition(n(lines[53]), n(lines[54])); // HSI position
        instrCDI.setPosition(n(lines[77]), n(lines[78])); // CDI position

        if (lines[111].includes('1')) // ukljucen VORa radial 1
            VORa.loadRadial(lines[99], lines[100]); // VORa radial 1
        if (lines[112].includes('1')) // ukljucen VORa radial 2
            VORa.loadRadial(lines[101], lines[102]); // VORa radial 2
        if (lines[113].includes('1')) // ukljucen VORa radial 3
            VORa.loadRadial(lines[103], lines[104]); // VORa radial 3
        if (lines[114].includes('1')) // ukljucen VORa radial 4
            VORa.loadRadial(lines[105], lines[106]); // VORa radial 4
        if (lines[115].includes('1')) // ukljucen VORa radial 5
            VORa.loadRadial(lines[107], lines[108]); // VORa radial 5

        if (lines[133].includes('1')) // ukljucen VORb radial 1
            VORb.loadRadial(lines[121], lines[122]); // VORb radial 1
        if (lines[134].includes('1')) // ukljucen VORb radial 2
            VORb.loadRadial(lines[123], lines[124]); // VORb radial 2
        if (lines[135].includes('1')) // ukljucen VORb radial 3
            VORb.loadRadial(lines[125], lines[126]); // VORb radial 3
        if (lines[136].includes('1')) // ukljucen VORb radial 4
            VORb.loadRadial(lines[127], lines[128]); // VORb radial 4
        if (lines[137].includes('1')) // ukljucen VORb radial 5
            VORb.loadRadial(lines[129], lines[130]); // VORb radial 5

        if (lines[155].includes('1')) // ukljucen NDB radial 1
            NDB.loadRadial(lines[143], lines[144]); // NDB radial 1
        if (lines[156].includes('1')) // ukljucen NDB radial 2
            NDB.loadRadial(lines[145], lines[146]); // NDB radial 2
        if (lines[157].includes('1')) // ukljucen NDB radial 3
            NDB.loadRadial(lines[147], lines[148]); // NDB radial 3
        if (lines[158].includes('1')) // ukljucen NDB radial 4
            NDB.loadRadial(lines[149], lines[150]); // NDB radial 4
        if (lines[159].includes('1')) // ukljucen NDB radial 5
            NDB.loadRadial(lines[154], lines[152]); // NDB radial 5

        player.speed = n(lines[165]); // AC speed
        wind.direction = n(lines[166]); // wind direction
        wind.speed = n(lines[167]); // wind speed

        player.setVisible(lines[168].includes('True')); // show aircraft
        setCourseLinesVisible(lines[169].includes('True')); // show course lines
        // pauseMovement(lines[170].includes('True')); // paused
        instrDG.setVisible(lines[171].includes('True')); // DG
        instrRBI.setVisible(lines[172].includes('True')); // RBI
        instrRMI.setVisible(lines[173].includes('True')); // RMI
        instrHSI.setVisible(lines[174].includes('True')); // HSI
        instrCDI.setVisible(lines[175].includes('True')); // CDI

        // if (lines[176].includes('True')) // Arc VORa visible
        //     lines[177], lines[178], lines[179] // Arc VORa data
        // if (lines[180].includes('True')) // Arc VORb visible
        //     lines[181], lines[182], lines[183] // Arc VORb data

        // setup information
        let i = 185;
        mSetupInfo.value = '';
        while (lines[i] !== undefined) {
            if (lines[i].includes('EndOfSetupInfo010203'))
                break;
            mSetupInfo.value = mSetupInfo.value + lines[i] + '\n';
            i++;
        }
    };

    reader.readAsText(file);
}