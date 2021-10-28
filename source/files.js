/* SAVE FILE */
function saveSetup() {
    let setup;
    setup = {
        airplane: {
            speed: player.speed,
            angle: player.angle,
            position: {
                x: player.position.x,
                y: player.position.y
            },
            visible: swAirplaneVisible.checked
        },
        wind: {
            speed: wind.speed,
            direction: wind.direction
        },
        groundRadars: {
            NDB: {
                position: {
                    x: NDB.position.x,
                    y: NDB.position.y
                },
                radials: NDB.getRadialsJSON()
            },
            VORa: {
                position: {
                    x: VORa.position.x,
                    y: VORa.position.y
                },
                radials: VORa.getRadialsJSON(),
                arc: VORa.arcCurveData
            },
            VORb: {
                position: {
                    x: VORb.position.x,
                    y: VORb.position.y
                },
                radials: VORb.getRadialsJSON(),
                arc: VORb.arcCurveData
            }
        },
        instruments: {
            DG: {
                position: {
                    x: instrDG.position.x,
                    y: instrDG.position.y
                },
                visible: swInstrumentDG.checked
            },
            RBI: {
                position: {
                    x: instrRBI.position.x,
                    y: instrRBI.position.y
                },
                visible: swInstrumentRBI.checked
            },
            RMI: {
                position: {
                    x: instrRMI.position.x,
                    y: instrRMI.position.y
                },
                visible: swInstrumentRMI.checked
            },
            HSI: {
                position: {
                    x: instrHSI.position.x,
                    y: instrHSI.position.y
                },
                visible: swInstrumentHSI.checked,
                CRSAngle: instrHSI.CRSArrowAngle
            },
            CDI: {
                position: {
                    x: instrCDI.position.x,
                    y: instrCDI.position.y
                },
                visible: swInstrumentCDI.checked,
                OBSAngle: instrCDI.OBSArrowAngle
            }
        },
        courseLinesVisible: swCourseLinesVisible.checked,
        setupInfo: mSetupInfo.value
    }
    saveFile('Setup1.nav', JSON.stringify(setup));
}

/* LOAD FILE */
function loadSetup(file) {
    let reader = new FileReader();
    let obj;
    reader.onload = () => {
        try { obj = JSON.parse(reader.result) }
        catch { return loadSetupOld(reader.result) }

        pauseMovement(true);
        resetGroundRadars();
        player.reset();

        try {
            // Airplane
            player.setPosition(obj.airplane.position.x, obj.airplane.position.y);
            player.speed = obj.airplane.speed;
            player.angle = obj.airplane.angle;
            player.setVisible(obj.airplane.visible);

            // Wind
            wind.speed = obj.wind.speed;
            wind.direction = obj.wind.direction;

            // NDB
            NDB.setPosition(obj.groundRadars.NDB.position.x, obj.groundRadars.NDB.position.y);
            for (let i = 0; i < obj.groundRadars.NDB.radials.length; i++)
                NDB.loadRadial(obj.groundRadars.NDB.radials[i].x, obj.groundRadars.NDB.radials[i].y);

            // VORa
            VORa.setPosition(obj.groundRadars.VORa.position.x, obj.groundRadars.VORa.position.y);
            VORa.drawArcCurve(obj.groundRadars.VORa.arc.radius, obj.groundRadars.VORa.arc.start, obj.groundRadars.VORa.arc.length);
            for (let i = 0; i < obj.groundRadars.VORa.radials.length; i++)
                VORa.loadRadial(obj.groundRadars.VORa.radials[i].x, obj.groundRadars.VORa.radials[i].y);

            // VORb
            VORb.setPosition(obj.groundRadars.VORb.position.x, obj.groundRadars.VORb.position.y);
            VORb.drawArcCurve(obj.groundRadars.VORb.arc.radius, obj.groundRadars.VORb.arc.start, obj.groundRadars.VORb.arc.length);
            for (let i = 0; i < obj.groundRadars.VORb.radials.length; i++)
                VORb.loadRadial(obj.groundRadars.VORb.radials[i].x, obj.groundRadars.VORb.radials[i].y);

            // Instruments
            instrDG.setPosition(obj.instruments.DG.position.x, obj.instruments.DG.position.y);   
            instrDG.setVisible(obj.instruments.DG.visible);  
            instrRBI.setPosition(obj.instruments.RBI.position.x, obj.instruments.RBI.position.y); 
            instrRBI.setVisible(obj.instruments.RBI.visible); 
            instrRMI.setPosition(obj.instruments.RMI.position.x, obj.instruments.RMI.position.y); 
            instrRMI.setVisible(obj.instruments.RMI.visible); 
            instrHSI.setPosition(obj.instruments.HSI.position.x, obj.instruments.HSI.position.y);  
            instrHSI.setCRSAngle(obj.instruments.HSI.CRSAngle)
            instrHSI.setVisible(obj.instruments.HSI.visible); 
            instrCDI.setPosition(obj.instruments.CDI.position.x, obj.instruments.CDI.position.y); 
            instrCDI.setOBSAngle(obj.instruments.CDI.OBSAngle)
            instrCDI.setVisible(obj.instruments.CDI.visible); 

            // Other
            setCourseLinesVisible(obj.courseLinesVisible);
            mSetupInfo.value = obj.setupInfo;
        }
        catch {
            alert('Invalid file provided!')
        }
    }
    reader.readAsText(file);
}

function loadSetupOld(lines) {
    const n = (value) => Number(value.replace(',', '.'));
    lines = lines.split('\n');
    if (lines.length < 186) {
        alert('File not valid!');
        return false;
    }

    pauseMovement(true);
    resetGroundRadars();
    player.reset();

    player.setPosition(n(lines[3]), n(lines[4]));       // aircraft position
    NDB.setPosition(n(lines[5]), n(lines[6]));          // NDB position
    player.angle = n(lines[26]);                        // Aircraft rotation 
    instrHSI.setCRSAngle(n(lines[27]));                 // HSI arrow angle
    instrCDI.setOBSAngle(n(lines[29]));                 // CDI arrow angle
    VORa.setPosition(n(lines[35]), n(lines[36]));       // VORa position
    VORb.setPosition(n(lines[37]), n(lines[38]));       // VORb position
    instrRMI.setPosition(n(lines[39]), n(lines[40]));   // RMI position
    instrDG.setPosition(n(lines[45]), n(lines[46]));    // DG position
    instrRBI.setPosition(n(lines[49]), n(lines[50]));   // RBI position
    instrHSI.setPosition(n(lines[53]), n(lines[54]));   // HSI position
    instrCDI.setPosition(n(lines[77]), n(lines[78]));   // CDI position

    /* CANNOT PROPERLY LOAD RADIAL POSITIONS */
    if (confirm('Radials cannot be properly loaded with the old version. Load them anyway?')) {
        if (lines[111].includes('1'))                       // visible VORa radial 1
            VORa.loadRadial(n(lines[99]), n(lines[100]));   // VORa radial 1
        if (lines[112].includes('1'))                       // visible VORa radial 2
            VORa.loadRadial(n(lines[101]), n(lines[102]));  // VORa radial 2
        if (lines[113].includes('1'))                       // visible VORa radial 3
            VORa.loadRadial(n(lines[103]), n(lines[104]));  // VORa radial 3
        if (lines[114].includes('1'))                       // visible VORa radial 4
            VORa.loadRadial(n(lines[105]), n(lines[106]));  // VORa radial 4
        if (lines[115].includes('1'))                       // visible VORa radial 5
            VORa.loadRadial(n(lines[107]), n(lines[108]));  // VORa radial 5

        if (lines[133].includes('1'))                       // visible VORb radial 1
            VORb.loadRadial(n(lines[121]), n(lines[122]));  // VORb radial 1
        if (lines[134].includes('1'))                       // visible VORb radial 2
            VORb.loadRadial(n(lines[123]), n(lines[124]));  // VORb radial 2
        if (lines[135].includes('1'))                       // visible VORb radial 3
            VORb.loadRadial(n(lines[125]), n(lines[126]));  // VORb radial 3
        if (lines[136].includes('1'))                       // visible VORb radial 4
            VORb.loadRadial(n(lines[127]), n(lines[128]));  // VORb radial 4
        if (lines[137].includes('1'))                       // visible VORb radial 5
            VORb.loadRadial(n(lines[129]), n(lines[130]));  // VORb radial 5

        if (lines[155].includes('1'))                       // visible NDB radial 1
            NDB.loadRadial(n(lines[143]), n(lines[144]));   // NDB radial 1
        if (lines[156].includes('1'))                       // visible NDB radial 2
            NDB.loadRadial(n(lines[145]), n(lines[146]));   // NDB radial 2
        if (lines[157].includes('1'))                       // visible NDB radial 3
            NDB.loadRadial(n(lines[147]), n(lines[148]));   // NDB radial 3
        if (lines[158].includes('1'))                       // visible NDB radial 4
            NDB.loadRadial(n(lines[149]), n(lines[150]));   // NDB radial 4
        if (lines[159].includes('1'))                       // visible NDB radial 5
            NDB.loadRadial(n(lines[154]), n(lines[152]));   // NDB radial 5
    }

    player.speed = n(lines[165]);       // AC speed
    wind.direction = n(lines[166]);     // wind direction
    wind.speed = n(lines[167]);         // wind speed

    player.setVisible(lines[168].includes('True'));     // show aircraft
    setCourseLinesVisible(lines[169].includes('True')); // show course lines
    instrDG.setVisible(lines[171].includes('True'));    // DG
    instrRBI.setVisible(lines[172].includes('True'));   // RBI
    instrRMI.setVisible(lines[173].includes('True'));   // RMI
    instrHSI.setVisible(lines[174].includes('True'));   // HSI
    instrCDI.setVisible(lines[175].includes('True'));   // CDI

    if (lines[176].includes('True')) {                                  // Arc VORa visible
        rbVORA.checked = true;
        VORa.drawArcCurve(n(lines[177]), n(lines[178]), n(lines[179])); // Arc VORa data
    }
    if (lines[180].includes('True')) {                                  // Arc VORb visible
        rbVORB.checked = true;
        VORb.drawArcCurve(n(lines[181]), n(lines[182]), n(lines[183])); // Arc VORb data
    }
    updateEditorValues();

    // setup information
    let i = 185;
    mSetupInfo.value = '';
    while (lines[i] !== undefined) {
        if (lines[i].includes('EndOfSetupInfo010203'))
            break;
        mSetupInfo.value = mSetupInfo.value + lines[i] + '\n';
        i++;
    };
}

/* HELPERS */
function saveFile(filename, text) {
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}