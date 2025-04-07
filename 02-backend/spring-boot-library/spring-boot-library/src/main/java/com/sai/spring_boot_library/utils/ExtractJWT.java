package com.sai.spring_boot_library.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    public static String payLoadJWTExtraction(String token , String extract){
        token.replace("Bearer","");

        String[] chunks = token.split("\\.");



        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunks[1]));

        String[] entries = payload.split(",");



        Map<String, String> map = new HashMap<String, String>();

        for(String entry:entries){

            String[] keyValues =entry.split(":");
            if(keyValues[0].equals(extract)){
                int remove=1;

                if(keyValues[1].endsWith("}")){
                    remove=2;
                }
                keyValues[1] = keyValues[1].substring(0,keyValues[1].length()-remove);
                keyValues[1] = keyValues[1].substring(1);


                map.put(keyValues[0], keyValues[1]);
            }

        }

        if(map.containsKey(extract)){

            return map.get(extract);
        }


        return null;
    }
}
